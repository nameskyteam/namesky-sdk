import {
  ACTION_MAX_NUM,
  getPendingRegistrantId,
  getDefaultCoreContractId,
  getDefaultMarketplaceContractId,
  getDefaultSpaceshipContractId,
  getDefaultUserSettingContractId,
  isBrowser,
  moveRegistrantPublicKeyToEnd,
  REGISTRANT_KEYSTORE_PREFIX,
  sleep,
  wait,
} from '../utils';
import { CoreContract } from './contracts';
import { MarketplaceContract } from './contracts';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { NameSkyComponent, NameSkyOptions, Network } from './types/config';
import { CleanStateArgs, InitArgs } from './types/args';
import {
  GetControllerOwnerIdOptions,
  MintOptions,
  NftRegisterOptions,
  SetupControllerOptions,
  WaitForMintingOptions,
} from './types/options';
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
import { NameSkySigner } from './NameSkySigner';

export class NameSky {
  private near: Near;

  signer: NameSkySigner;
  keyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;

  constructor({
    signer,
    keyStore,
    coreContract,
    marketplaceContract,
    userSettingContract,
    spaceshipContract,
  }: NameSkyComponent) {
    this.near = new Near({
      ...signer.network,
      keyStore,
    });

    this.signer = signer;
    this.keyStore = keyStore;

    this.coreContract = coreContract;
    this.marketplaceContract = marketplaceContract;
    this.userSettingContract = userSettingContract;
    this.spaceshipContract = spaceshipContract;

    if (isBrowser()) {
      void this.onRequestFullAccess();
    }
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): NameSky {
    return new NameSky({
      signer,
      keyStore: this.keyStore,
      coreContract: this.coreContract.connect(signer),
      marketplaceContract: this.marketplaceContract.connect(signer),
      userSettingContract: this.userSettingContract.connect(signer),
      spaceshipContract: this.spaceshipContract.connect(signer),
    });
  }

  get coreContractId(): string {
    return this.coreContract.contractId;
  }

  get marketplaceContractId(): string {
    return this.marketplaceContract.contractId;
  }

  get userSettingContractId(): string {
    return this.userSettingContract.contractId;
  }

  get spaceshipContactId(): string {
    return this.spaceshipContract.contractId;
  }

  get network(): Network {
    return this.signer.network;
  }

  private get provider(): Provider {
    return this.near.connection.provider;
  }

  private registrant(registrantId: string): MultiSendAccount {
    return MultiSendAccount.new(this.near.connection, registrantId);
  }

  /**
   * Request Full Access Key via web wallet (e.g. MyNearWallet)
   */
  async requestFullAccess(webWalletBaseUrl: string, successUrl?: string, failureUrl?: string): Promise<never> {
    if (!isBrowser()) {
      throw Error('requestFullAccess only available in browser environment');
    }

    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingRegistrantId = getPendingRegistrantId(publicKey);
    await this.setRegistrantKey(pendingRegistrantId, keyPair);

    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set('public_key', publicKey);
    newUrl.searchParams.set('success_url', successUrl ?? window.location.href);
    newUrl.searchParams.set('failure_url', failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());

    // waiting for direction
    endless();
  }

  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href);
    const registrantId = currentUrl.searchParams.get('account_id');
    const publicKey = currentUrl.searchParams.get('public_key');

    if (!publicKey || !registrantId) {
      return;
    }

    const pendingRegistrantId = getPendingRegistrantId(publicKey);
    const keyPair = await this.getRegistrantKey(pendingRegistrantId);

    if (!keyPair) {
      return;
    }

    await this.setRegistrantKey(registrantId, keyPair);
    await this.removeRegistrantKey(pendingRegistrantId);
  }

  /**
   * Get registrant key
   */
  async getRegistrantKey(registrantId: string): Promise<KeyPair | undefined> {
    return this.keyStore.getKey(this.network.networkId, registrantId);
  }

  /**
   * Set registrant key
   */
  async setRegistrantKey(registrantId: string, keyPair: KeyPair) {
    await this.keyStore.setKey(this.network.networkId, registrantId, keyPair);
  }

  /**
   * Remove registrant key
   */
  async removeRegistrantKey(registrantId: string) {
    await this.keyStore.removeKey(this.network.networkId, registrantId);
  }

  /**
   * Register NameSky NFT. (Step 1/3)
   */
  async register({ registrantId, gasForRegister }: NftRegisterOptions) {
    const [mintFee, oldMinterId] = await Promise.all([
      this.coreContract.get_mint_fee({}),
      this.coreContract.nft_get_minter_id({ args: { registrant_id: registrantId } }),
    ]);

    const mTx = MultiTransaction.batch(this.coreContractId).functionCall({
      methodName: 'nft_register',
      args: {
        minter_id: this.signer.accountId,
      },
      attachedDeposit: oldMinterId ? Amount.ONE_YOCTO : mintFee,
      gas: gasForRegister,
    });

    await this.registrant(registrantId).send(mTx);
  }

  /**
   * Setup NameSky NFT controller. (Step 2/3)
   */
  async setupController({ registrantId, gasForCleanState, gasForInit }: SetupControllerOptions) {
    //  we don't need to check conditions at the same block in this method
    const account = this.registrant(registrantId);

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
    const keyPair = await this.getRegistrantKey(registrantId);

    if (!keyPair) {
      throw Error(`No access key found for Account(${registrantId}) to setup controller`);
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

    await this.registrant(registrantId).send(mTx);
  }

  /**
   * Wait for minting. (Step 3/3)
   */
  async waitForMinting({ registrantId, timeout }: WaitForMintingOptions): Promise<NameSkyToken> {
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
        await sleep(5000);
      }
    }, timeout);
  }

  /**
   * Mint NameSky NFT, this is one click wrap of `register`, `setupController`, `waitForMinting`
   * @param options
   */
  async oneClickMint({
    registrantId,
    gasForRegister,
    gasForCleanState,
    gasForInit,
  }: MintOptions): Promise<NameSkyToken> {
    await this.register({ registrantId, gasForRegister });
    await this.setupController({ registrantId, gasForCleanState, gasForInit });
    return this.waitForMinting({ registrantId });
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

      this.registrant(accountId).viewState('', blockQuery),

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
    const account = this.registrant(accountId);
    return account.view({
      contractId: accountId,
      methodName: 'get_owner_id',
      blockQuery,
    });
  }
}

export async function initNameSky(options: NameSkyOptions): Promise<NameSky> {
  const { signer, contracts } = options;

  let keyStore: keyStores.KeyStore;

  if ('accountId' in signer) {
    keyStore = new keyStores.InMemoryKeyStore();
  } else {
    keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage, REGISTRANT_KEYSTORE_PREFIX);
  }

  const networkId = signer.network.networkId;

  const coreContract = new CoreContract(contracts?.coreContractId ?? getDefaultCoreContractId(networkId), signer);

  const marketplaceContract = new MarketplaceContract(
    contracts?.marketplaceContractId ?? getDefaultMarketplaceContractId(networkId),
    signer
  );

  const userSettingContract = new UserSettingContract(
    contracts?.userSettingContractId ?? getDefaultUserSettingContractId(networkId),
    signer
  );

  const spaceshipContract = new SpaceshipContract(
    contracts?.spaceshipContractId ?? getDefaultSpaceshipContractId(networkId),
    signer
  );

  return new NameSky({ signer, keyStore, coreContract, marketplaceContract, userSettingContract, spaceshipContract });
}
