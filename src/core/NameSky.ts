import { sleep, wait } from '../utils';
import { CoreContract, MarketplaceContract, UserSettingContract } from './contracts';
import {
  CleanStateArgs,
  InitArgs,
  NftRegisterArgs,
  NameSkyComponent,
  NameSkyOptions,
  Network,
  GetControllerOwnerIdOptions,
  GetNftAccountSafetyOptions,
  NftAccountSafety,
  NameSkyToken,
  StateList,
} from '../types';
import {
  Amount,
  BlockQuery,
  BorshSchema,
  Gas,
  MultiSendAccount,
  MultiTransaction,
  Stringifier,
} from 'multi-transaction';
import { JsonRpcProvider, Provider } from '@near-js/providers';
import { KeyPairEd25519, KeyPair } from '@near-js/crypto';
import { AccessKeyList, AccountView } from '@near-js/types';
import { KeyPairSigner } from '@near-js/signers';
import { KeyStore, InMemoryKeyStore } from '@near-js/keystores';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';
import { Buffer } from 'buffer';
import { NameSkyUser } from './NameSkyUser';
import { buildPendingRegistrantId, isBrowser, moveRegistrantPublicKeyToEnd } from '../utils/internal';
import { ACTION_MAX_NUM, REGISTRANT_KEYSTORE_PREFIX } from '../utils/constants';
import {
  getDefaultCoreContractId,
  getDefaultMarketplaceContractId,
  getDefaultUserSettingContractId,
} from '../utils/contracts';
import { NameSkyError } from '../errors';

export class NameSky {
  private readonly provider: Provider;
  private readonly registrantKeyStore: KeyStore;

  user: NameSkyUser;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;

  constructor({ user, registrantKeyStore, coreContract, marketplaceContract, userSettingContract }: NameSkyComponent) {
    this.provider = new JsonRpcProvider({
      url: user.network.nodeUrl,
    });
    this.registrantKeyStore = registrantKeyStore;

    this.user = user;

    this.coreContract = coreContract;
    this.marketplaceContract = marketplaceContract;
    this.userSettingContract = userSettingContract;

    if (isBrowser()) {
      void this.onRequestFullAccess();
    }
  }

  /**
   * Connect to new user and return new instance
   */
  connect(user: NameSkyUser): NameSky {
    return new NameSky({
      user,
      registrantKeyStore: this.registrantKeyStore,
      coreContract: this.coreContract.connect(user),
      marketplaceContract: this.marketplaceContract.connect(user),
      userSettingContract: this.userSettingContract.connect(user),
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

  get network(): Network {
    return this.user.network;
  }

  private async account(accountId: string = ''): Promise<MultiSendAccount> {
    const keyPair = await this.registrantKeyStore.getKey(this.network.networkId, accountId);
    return MultiSendAccount.new(this.provider, accountId, new KeyPairSigner(keyPair));
  }

  /**
   * Request Full Access Key via web wallet (e.g. MyNearWallet)
   */
  async requestFullAccess(options: RequestFullAccessOptions): Promise<never> {
    const { walletBaseUrl, successUrl, failureUrl } = options;

    if (!isBrowser()) {
      throw new NameSkyError('requestFullAccess only available on browser environment');
    }

    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingRegistrantId = buildPendingRegistrantId(publicKey);
    await this.setRegistrantKey(pendingRegistrantId, keyPair);

    const newUrl = new URL(walletBaseUrl + '/login/');
    newUrl.searchParams.set('public_key', publicKey);
    newUrl.searchParams.set('success_url', successUrl ?? window.location.href);
    newUrl.searchParams.set('failure_url', failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());

    while (true) {
      // waiting for direction
    }
  }

  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href);
    const registrantId = currentUrl.searchParams.get('account_id');
    const publicKey = currentUrl.searchParams.get('public_key');

    if (!publicKey || !registrantId) {
      return;
    }

    const pendingRegistrantId = buildPendingRegistrantId(publicKey);
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
    return this.registrantKeyStore.getKey(this.network.networkId, registrantId);
  }

  /**
   * Set registrant key
   */
  async setRegistrantKey(registrantId: string, keyPair: KeyPair) {
    await this.registrantKeyStore.setKey(this.network.networkId, registrantId, keyPair);
  }

  /**
   * Remove registrant key
   */
  async removeRegistrantKey(registrantId: string) {
    await this.registrantKeyStore.removeKey(this.network.networkId, registrantId);
  }

  /**
   * Register NameSky NFT
   */
  async register(registrantId: string) {
    const [mintFee, oldMinterId] = await Promise.all([
      this.coreContract.getMintFee({}),
      this.coreContract.nftGetMinterId({ registrantId }),
    ]);

    const minterId = this.user.accountId;

    if (oldMinterId && oldMinterId === minterId) {
      console.log(`Registrant ${registrantId} is already registered with for minter ${minterId}`);
      return;
    }

    const mTransaction = MultiTransaction.batch(this.coreContractId).functionCall<NftRegisterArgs>({
      methodName: 'nft_register',
      args: {
        minter_id: minterId,
      },
      attachedDeposit: oldMinterId ? Amount.ONE_YOCTO : mintFee,
    });

    const account = await this.account(registrantId);

    await account.send(mTransaction);
  }

  /**
   * Setup NameSky NFT controller
   */
  async setupController(registrantId: string, gasForCleanState?: string) {
    const { isCodeHashCorrect, isStateCleaned, isAccessKeysDeleted, isControllerOwnerIdCorrect, state, accessKeys } =
      await this.getNftAccountSafety({ accountId: registrantId, strict: true });

    if (isCodeHashCorrect && isStateCleaned && isAccessKeysDeleted && isControllerOwnerIdCorrect) {
      return;
    }

    const code = await this.coreContract.getLatestControllerCode({});

    const mTransaction = MultiTransaction.batch(registrantId);

    // deploy controller contract
    mTransaction.deployContract(Buffer.from(code, 'base64'));

    // clean account state if needed
    if (state.length !== 0) {
      const stateKeys = state.map(({ key }) => Buffer.from(key, 'base64'));
      mTransaction.functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: stateKeys.map((stateKey) => Array.from(stateKey)),
        stringifier: Stringifier.borsh(BorshSchema.Array(BorshSchema.Vec(BorshSchema.u8), stateKeys.length)),
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gasForCleanState,
      });
    }

    // init controller contract
    mTransaction.functionCall<InitArgs>({
      methodName: 'init',
      args: Buffer.from(this.coreContractId),
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(10, 'T'),
    });

    // delete all access keys
    const keyPair = await this.getRegistrantKey(registrantId);

    if (!keyPair) {
      throw new NameSkyError(`No access key found for Account(${registrantId}) to setup controller`);
    }

    const registrantPublicKey = keyPair.getPublicKey().toString();
    let publicKeys = accessKeys.map((accessKey) => accessKey.public_key);
    publicKeys = moveRegistrantPublicKeyToEnd(registrantPublicKey, publicKeys);

    for (const publicKey of publicKeys) {
      if (mTransaction.countActions() === ACTION_MAX_NUM) {
        mTransaction.batch(registrantId);
      }
      mTransaction.deleteKey(publicKey);
    }

    const account = await this.account(registrantId);

    await account.send(mTransaction);
  }

  /**
   * Preparation for minting NameSky NFT, this is wrap of `register` and `setupController`
   */
  async prepareMint(registrantId: string, gasForCleanState?: string) {
    await this.register(registrantId);
    await this.setupController(registrantId, gasForCleanState);
  }

  /**
   * Wait mint completed.
   * Mint process is handled by NameSky mint service
   */
  async waitMintCompleted(registrantId: string, timeout?: number): Promise<NameSkyToken> {
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

  async getNftAccountSafety(options: GetNftAccountSafetyOptions): Promise<NftAccountSafety> {
    const { accountId, strict = false, blockQuery = await BlockQuery.OPTIMISTIC.height(this.provider) } = options;

    const [controllerCodeViews, accountView, { values: state }, { keys: accessKeys }] = await Promise.all([
      this.coreContract.getControllerCodeViews({ blockQuery }),

      this.provider.query<AccountView>({
        ...blockQuery.toReference(),
        request_type: 'view_account',
        account_id: accountId,
      }),

      this.provider.query<StateList>({
        ...blockQuery.toReference(),
        request_type: 'view_state',
        account_id: accountId,
        prefix_base64: '',
      }),

      this.provider.query<AccessKeyList>({
        ...blockQuery.toReference(),
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

  private async getControllerOwnerId(options: GetControllerOwnerIdOptions): Promise<string> {
    const { accountId, blockQuery } = options;
    const account = await this.account();
    return account.view({
      contractId: accountId,
      methodName: 'get_owner_id',
      blockQuery,
    });
  }
}

export async function initNameSky(options: NameSkyOptions): Promise<NameSky> {
  const { user, contracts = {} } = options;
  const { coreContractId, marketplaceContractId, userSettingContractId } = contracts;

  let registrantKeyStore = options.registrantKeyStore;

  if (!registrantKeyStore) {
    if ('accountId' in user.sender) {
      registrantKeyStore = new InMemoryKeyStore();
    } else {
      registrantKeyStore = new BrowserLocalStorageKeyStore(localStorage, REGISTRANT_KEYSTORE_PREFIX);
    }
  }

  const networkId = user.network.networkId;

  const coreContract = new CoreContract({
    contractId: coreContractId ?? getDefaultCoreContractId(networkId),
    user,
  });

  const marketplaceContract = new MarketplaceContract({
    coreContractId: coreContract.contractId,
    contractId: marketplaceContractId ?? getDefaultMarketplaceContractId(networkId),
    user,
  });

  const userSettingContract = new UserSettingContract({
    contractId: userSettingContractId ?? getDefaultUserSettingContractId(networkId),
    user,
  });

  return new NameSky({
    user,
    registrantKeyStore,
    coreContract,
    marketplaceContract,
    userSettingContract,
  });
}

export type RequestFullAccessOptions = {
  walletBaseUrl: string;
  successUrl?: string;
  failureUrl?: string;
};
