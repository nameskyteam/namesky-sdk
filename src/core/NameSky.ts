import {
  ACTION_MAX_NUM,
  getCoreContractId,
  getMarketplaceContractId,
  getSpaceshipContractId,
  getUserSettingContractId,
  isBrowser,
  moveRegistrantPublicKeyToEnd,
  REGISTRANT_KEYSTORE_PREFIX,
  resolveNetwork,
  sleep,
  wait,
} from '../utils';
import { CoreContract } from './contracts';
import { MarketplaceContract } from './contracts';
import { KeyPairEd25519, PublicKey } from 'near-api-js/lib/utils';
import { REQUEST_ACCESS_PENDING_KEY_PREFIX } from '../utils';
import { NameSkyComponent, NameSkyConfig, Network, NetworkId } from './types/config';
import { CleanStateArgs, InitArgs } from './types/args';
import { GetControllerOwnerIdOptions, NftRegisterOptions, SetupControllerOptions } from './types/options';
import { UserSettingContract } from './contracts/UserSettingContract';
import { base58CodeHash } from '../utils';
import {
  Amount,
  BlockQuery,
  BorshSchema,
  endless,
  MultiSendAccount,
  MultiTransaction,
  Stringifier,
} from 'multi-transaction';
import { AccessKeyList, AccountView, Provider } from 'near-api-js/lib/providers/provider';
import { NameSkyNftSafety, NameSkyToken } from './types/data';
import { Buffer } from 'buffer';
import { SpaceshipContract } from './contracts/SpaceshipContract';
import { KeyPair, keyStores, Near } from 'near-api-js';
import { NameSkyRunner } from './NameSkyRunner';

export class NameSky {
  network: Network;
  private near: Near;
  private keyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;

  constructor({
    network,
    keyStore,
    coreContract,
    marketplaceContract,
    userSettingContract,
    spaceshipContract,
  }: NameSkyComponent) {
    this.network = network;
    this.near = new Near({
      ...network,
      keyStore,
    });
    this.keyStore = keyStore;

    this.coreContract = coreContract;
    this.marketplaceContract = marketplaceContract;
    this.userSettingContract = userSettingContract;
    this.spaceshipContract = spaceshipContract;

    if (isBrowser()) {
      void this.onRequestFullAccess();
    }
  }

  private get coreContractId(): string {
    return this.coreContract.contractId;
  }

  private get marketplaceContractId(): string {
    return this.marketplaceContract.contractId;
  }

  private get userSettingContractId(): string {
    return this.userSettingContract.contractId;
  }

  private get spaceshipContactId(): string {
    return this.spaceshipContract.contractId;
  }

  private get networkId(): NetworkId {
    return this.network.networkId;
  }

  private get nodeUrl(): string {
    return this.network.nodeUrl;
  }

  private get provider(): Provider {
    return this.near.connection.provider;
  }

  private account(accountId: string): MultiSendAccount {
    return MultiSendAccount.new(this.near.connection, accountId);
  }

  async requestFullAccess(webWalletBaseUrl: string, successUrl?: string, failureUrl?: string): Promise<never> {
    if (!isBrowser()) {
      throw Error('requestFullAccess only available in browser environment');
    }

    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + publicKey;
    await this.keyStore.setKey(this.networkId, pendingAccountId, keyPair);

    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set('public_key', publicKey);
    newUrl.searchParams.set('success_url', successUrl ?? window.location.href);
    newUrl.searchParams.set('failure_url', failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());

    // waiting for direction
    endless();
  }

  // auto callback
  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href);
    const accountId = currentUrl.searchParams.get('account_id');
    const publicKey = currentUrl.searchParams.get('public_key');

    if (!publicKey || !accountId) {
      return;
    }

    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + PublicKey.fromString(publicKey).toString();
    const keyPair = await this.keyStore.getKey(this.networkId, pendingAccountId);

    if (!keyPair) {
      return;
    }

    await this.keyStore.setKey(this.networkId, accountId, keyPair);
    await this.keyStore.removeKey(this.networkId, pendingAccountId);
  }

  async getRegistrantKey(registrantId: string): Promise<KeyPair> {
    return this.keyStore.getKey(this.networkId, registrantId);
  }

  async setRegistrantKey(registrantId: string, keyPair: KeyPair) {
    await this.keyStore.setKey(this.networkId, registrantId, keyPair);
  }

  async removeRegistrantKey(registrantId: string) {
    await this.keyStore.removeKey(this.networkId, registrantId);
  }

  async register({ registrantId, minterId, gas }: NftRegisterOptions) {
    const [mintFee, oldMinterId] = await Promise.all([
      this.coreContract.get_mint_fee({}),
      this.coreContract.nft_get_minter_id({ args: { registrant_id: registrantId } }),
    ]);

    const mTx = MultiTransaction.batch(this.coreContractId).functionCall({
      methodName: 'nft_register',
      args: {
        minter_id: minterId,
      },
      attachedDeposit: oldMinterId ? Amount.ONE_YOCTO : mintFee,
      gas,
    });

    const registrant = this.account(registrantId);
    await registrant.send(mTx);
  }

  async setupController({ registrantId, gasForCleanState, gasForInit }: SetupControllerOptions) {
    //  we don't need to check conditions at the same block in this method
    const account = this.account(registrantId);

    // code hash
    const codeBase64 = await this.coreContract.get_latest_controller_code({});
    const code = Buffer.from(codeBase64, 'base64');
    const accountView = await account.state();
    const accountCodeHash = accountView.code_hash;
    const codeHash = base58CodeHash(code);

    // state
    const state = await account.viewState('');

    // access keys
    const accessKeys = await account.getAccessKeys();

    const isCodeHashCorrect = accountCodeHash === codeHash;
    const isStateCleaned = state.length === 1;
    const isAccessKeysDeleted = accessKeys.length === 0;

    if (isCodeHashCorrect && isStateCleaned && isAccessKeysDeleted) {
      // controller owner id
      const controllerOwnerId = await this.getControllerOwnerId({ accountId: registrantId });
      const isControllerOwnerIdCorrect = controllerOwnerId === this.coreContract.contractId;
      if (isControllerOwnerIdCorrect) {
        // skip
        return;
      }
    }

    const mTx = MultiTransaction.batch(registrantId);

    // deploy controller contract
    mTx.deployContract(code);

    // clean account state if needed
    if (state.length !== 0) {
      const stateKeys = state.map(({ key }) => key);
      mTx.functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: stateKeys,
        stringifier: Stringifier.borsh(BorshSchema.Array(BorshSchema.Vec(BorshSchema.u8), stateKeys.length)),
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gasForCleanState,
      });
    }

    // init controller contract
    mTx.functionCall<InitArgs>({
      methodName: 'init',
      args: Buffer.from(this.coreContractId), // raw args
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gasForInit,
    });

    // delete all access keys
    const keyPair = await this.keyStore.getKey(this.networkId, registrantId);

    if (!keyPair) {
      throw Error(`No access key found locally for Account(${registrantId}) to sign transaction.`);
    }

    const registrantPublicKey = keyPair.getPublicKey().toString();
    let publicKeys = accessKeys.map((accessKey) => accessKey.public_key);
    publicKeys = moveRegistrantPublicKeyToEnd(registrantPublicKey, publicKeys);

    for (const publicKey of publicKeys) {
      if (mTx.countActions() < ACTION_MAX_NUM) {
        mTx.deleteKey(publicKey);
      } else {
        mTx.batch(registrantId).deleteKey(publicKey);
      }
    }

    const registrant = this.account(registrantId);
    await registrant.send(mTx);
  }

  async waitForMinting(registrantId: string, timeout?: number): Promise<NameSkyToken> {
    return wait(async () => {
      while (true) {
        const token = await this.coreContract.nft_namesky_token({
          args: {
            token_id: registrantId,
          },
        });

        if (token) {
          console.log(`NameSkyNFT(${registrantId}) is minted`);
          return token;
        }

        console.log(`NameSkyNFT(${registrantId}) is on minting...`);
        await sleep(1000);
      }
    }, timeout);
  }

  async getNftAccountSafety(accountId: string): Promise<NameSkyNftSafety> {
    const block = await this.provider.block({ finality: 'optimistic' });

    const blockQuery: BlockQuery = { blockId: block.header.height };

    const [codeHash, controllerCodeViews, state, { keys: accessKeys }] = await Promise.all([
      this.provider
        .query<AccountView>({
          ...blockQuery,
          request_type: 'view_account',
          account_id: accountId,
        })
        .then((accountView) => accountView.code_hash),

      this.coreContract.get_controller_code_views({ blockQuery }),

      this.account(accountId).viewState('', blockQuery),

      this.provider.query<AccessKeyList>({
        ...blockQuery,
        request_type: 'view_access_key_list',
        account_id: accountId,
      }),
    ]);

    const isCodeHashCorrect = controllerCodeViews.some((view) => view.code_hash === codeHash);
    const isStateCleaned = state.length === 1;
    const isAccessKeysDeleted = accessKeys.length === 0;
    let isControllerOwnerIdCorrect = false;

    if (isCodeHashCorrect) {
      const controllerOwnerId = await this.getControllerOwnerId({
        accountId,
        blockQuery,
      });
      isControllerOwnerIdCorrect = controllerOwnerId === this.coreContract.contractId;
    }

    return { isCodeHashCorrect, isStateCleaned, isAccessKeysDeleted, isControllerOwnerIdCorrect };
  }

  private async getControllerOwnerId({ accountId, blockQuery }: GetControllerOwnerIdOptions): Promise<string> {
    const account = this.account(accountId);
    return account.view({
      contractId: accountId,
      methodName: 'get_owner_id',
      blockQuery,
    });
  }
}

export async function initNameSky(config: NameSkyConfig): Promise<NameSky> {
  const network = resolveNetwork(config.network);
  const { signer, contracts } = config;

  let runner: NameSkyRunner;
  let keyStore: keyStores.KeyStore;

  if ('accountId' in signer) {
    runner = await NameSkyRunner.fromAccount(signer);
    keyStore = new keyStores.InMemoryKeyStore();
  } else {
    runner = await NameSkyRunner.fromWalletSelector(signer);
    keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage, REGISTRANT_KEYSTORE_PREFIX);
  }

  const coreContract = new CoreContract(contracts?.coreContractId ?? getCoreContractId(network.networkId), runner);
  const marketplaceContract = new MarketplaceContract(
    contracts?.marketplaceContractId ?? getMarketplaceContractId(network.networkId),
    runner
  );
  const userSettingContract = new UserSettingContract(
    contracts?.userSettingContractId ?? getUserSettingContractId(network.networkId),
    runner
  );
  const spaceshipContract = new SpaceshipContract(
    contracts?.spaceshipContractId ?? getSpaceshipContractId(network.networkId),
    runner
  );

  return new NameSky({ network, keyStore, coreContract, marketplaceContract, userSettingContract, spaceshipContract });
}
