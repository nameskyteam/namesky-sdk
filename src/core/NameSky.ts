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
import { CleanStateArgs, InitArgs, NftRegisterArgs } from './types/args';
import { GetControllerOwnerIdOptions } from './types/view-options';
import { UserSettingContract } from './contracts/UserSettingContract';
import {
  Amount,
  BlockQuery,
  BorshSchema,
  endless,
  Gas,
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
import { StateList } from './types/common';

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
   * Register NameSky NFT
   */
  async register(registrantId: string) {
    const [mintFee, oldMinterId] = await Promise.all([
      this.coreContract.getMintFee({}),
      this.coreContract.nftGetMinterId({ registrantId }),
    ]);

    const minterId = this.signer.accountId;

    if (oldMinterId && oldMinterId === minterId) {
      console.log(`Registrant ${registrantId} is already registered with for minter ${minterId}`);
      return;
    }

    const mTx = MultiTransaction.batch(this.coreContractId).functionCall<NftRegisterArgs>({
      methodName: 'nft_register',
      args: {
        minter_id: minterId,
      },
      attachedDeposit: oldMinterId ? Amount.ONE_YOCTO : mintFee,
    });

    await this.registrant(registrantId).send(mTx);
  }

  /**
   * Setup NameSky NFT controller
   */
  async setupController(registrantId: string, gasForCleanState?: string) {
    const {
      blockQuery,
      isCodeHashCorrect,
      isStateCleaned,
      isAccessKeysDeleted,
      isControllerOwnerIdCorrect,
      state,
      accessKeys,
    } = await this.getNftAccountSafety(registrantId, true);

    if (isCodeHashCorrect && isStateCleaned && isAccessKeysDeleted && isControllerOwnerIdCorrect) {
      return;
    }

    const code = await this.coreContract.getLatestControllerCode({ blockQuery });

    const mTx = MultiTransaction.batch(registrantId);

    // deploy controller contract
    mTx.deployContract(Buffer.from(code, 'base64'));

    // clean account state if needed
    if (state.length !== 0) {
      const stateKeys = state.map(({ key }) => Buffer.from(key, 'base64'));
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
      args: Buffer.from(this.coreContractId),
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(10, 'T'),
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
   * Mint NameSky NFT, this is wrap of `register` and `setupController`
   */
  async postMint(registrantId: string, gasForCleanState?: string) {
    await this.register(registrantId);
    await this.setupController(registrantId, gasForCleanState);
  }

  /**
   * Wait for minting
   */
  async waitForMinting(registrantId: string, timeout?: number): Promise<NameSkyToken> {
    return wait(async () => {
      while (true) {
        const token = await this.coreContract.nftNameSkyToken({ tokenId: registrantId });

        if (token) {
          console.log(`NameSkyNFT(${registrantId}) is minted`);
          return token;
        }

        console.log(`NameSkyNFT(${registrantId}) is on minting...`);
        await sleep(5000);
      }
    }, timeout);
  }

  async getNftAccountSafety(accountId: string, strict = false): Promise<NameSkyNftSafety> {
    const block = await this.provider.block({ finality: 'optimistic' });

    const blockQuery: BlockQuery = { blockId: block.header.height };

    const [controllerCodeViews, accountView, { values: state }, { keys: accessKeys }] = await Promise.all([
      this.coreContract.getControllerCodeViews({ blockQuery }),

      this.provider.query<AccountView>({
        ...blockQuery,
        request_type: 'view_account',
        account_id: accountId,
      }),

      this.provider.query<StateList>({
        ...blockQuery,
        request_type: 'view_state',
        account_id: accountId,
        prefix_base64: '',
      }),

      this.provider.query<AccessKeyList>({
        ...blockQuery,
        request_type: 'view_access_key_list',
        account_id: accountId,
      }),
    ]);

    const codeHash = accountView.code_hash;
    const latestControllerCodeView = controllerCodeViews.reduce((pre, cur) => (pre.version > cur.version ? pre : cur));

    const isCodeHashCorrect = strict
      ? codeHash === latestControllerCodeView.code_hash
      : controllerCodeViews.some((controllerCodeView) => controllerCodeView.code_hash === codeHash);
    const isStateCleaned = state.length === 1;
    const isAccessKeysDeleted = accessKeys.length === 0;
    let isControllerOwnerIdCorrect = false;

    let controllerOwnerId: string | undefined;

    if (isCodeHashCorrect) {
      controllerOwnerId = await this.getControllerOwnerId({
        accountId,
        blockQuery,
      });
      isControllerOwnerIdCorrect = controllerOwnerId === this.coreContractId;
    }

    return {
      blockQuery,
      isCodeHashCorrect,
      isStateCleaned,
      isAccessKeysDeleted,
      isControllerOwnerIdCorrect,
      codeHash,
      state,
      accessKeys,
      controllerOwnerId,
    };
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

  const coreContract = new CoreContract({
    contractId: contracts?.coreContractId ?? getDefaultCoreContractId(networkId),
    signer,
  });

  const marketplaceContract = new MarketplaceContract({
    coreContractId: coreContract.contractId,
    contractId: contracts?.marketplaceContractId ?? getDefaultMarketplaceContractId(networkId),
    signer,
  });

  const userSettingContract = new UserSettingContract({
    contractId: contracts?.userSettingContractId ?? getDefaultUserSettingContractId(networkId),
    signer,
  });

  const spaceshipContract = new SpaceshipContract({
    contractId: contracts?.spaceshipContractId ?? getDefaultSpaceshipContractId(networkId),
    signer,
  });

  return new NameSky({ signer, keyStore, coreContract, marketplaceContract, userSettingContract, spaceshipContract });
}
