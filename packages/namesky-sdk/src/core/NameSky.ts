import { buildContractStateKeysRaw, getBase58CodeHash, REGISTRANT_KEYSTORE_PREFIX, WalletSelectorPlus } from '../utils';
import { CoreContract } from './contracts';
import { MarketplaceContract } from './contracts';
import { KeyPairEd25519, PublicKey } from 'near-api-js/lib/utils';
import { REQUEST_ACCESS_PENDING_KEY_PREFIX } from '../utils';
import { Network } from '@near-wallet-selector/core';
import { NameSkyComponent, NameSkyConfig } from './types/config';
import { Account } from 'near-api-js';
import { CleanStateArgs, InitArgs } from './types/args';
import { MultiTransaction } from '../utils';
import { Amount } from '../utils';
import { setupWalletSelectorPlus } from '../utils';
import { GetControllerOwnerIdOptions, SetupControllerOptions } from './types/options';
import { UserSettingContract } from './contracts/UserSettingContract';

export class NameSky {
  selector: WalletSelectorPlus;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;

  constructor({ selector, coreContract, marketplaceContract }: NameSkyComponent) {
    this.selector = selector;
    this.coreContract = coreContract;
    this.marketplaceContract = marketplaceContract;

    this.onRequestFullAccess()
      .then(() => console.log('onRequestFullAccess Success'))
      .catch((reason) => console.error('onRequestFullAccess Failed', reason));
  }

  getNetwork(): Network {
    return this.selector.options.network;
  }

  getNetworkId(): string {
    return this.getNetwork().networkId;
  }

  getCoreContractId(): string {
    return this.coreContract.contractId;
  }

  getMarketplaceContractId(): string {
    return this.marketplaceContract.contractId;
  }

  account(accountId: string): Promise<Account> {
    return this.selector.near.account(accountId);
  }

  async requestFullAccess(webWalletBaseUrl: string, successUrl?: string, failureUrl?: string) {
    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + publicKey;
    const keystore = this.selector.keyStore();
    const networkId = this.getNetworkId();
    await keystore.setKey(networkId, pendingAccountId, keyPair);
    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set('public_key', publicKey);
    newUrl.searchParams.set('success_url', successUrl ?? window.location.href);
    newUrl.searchParams.set('failure_url', failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());
  }

  // auto callback
  private async onRequestFullAccess() {
    const currentUrl = new URL(window.location.href);
    const publicKey = currentUrl.searchParams.get('public_key');
    const accountId = currentUrl.searchParams.get('account_id');
    if (!publicKey || !accountId) {
      return;
    }
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + PublicKey.fromString(publicKey).toString();
    const keystore = this.selector.keyStore();
    const networkId = this.getNetworkId();
    const keyPair = await keystore.getKey(networkId, pendingAccountId);
    if (!keyPair) {
      return;
    }
    await keystore.setKey(networkId, accountId, keyPair);
    await keystore.removeKey(networkId, pendingAccountId);
  }

  // signed by registrant
  async setupController({ registrantId, code, gasForCleanState, gasForInit }: SetupControllerOptions) {
    const account = await this.account(registrantId);

    // account code hash
    const accountState = await account.state();
    const accountCodeHash = accountState.code_hash;
    const codeHash = getBase58CodeHash(code);

    // account controller owner id
    const ownerId = await this.get_owner_id({ registrantId });

    // account contract state
    const contractState = await account.viewState('');
    const contractStateKeys = buildContractStateKeysRaw(contractState);

    // account access keys
    const accessKeys = await account.getAccessKeys();
    const publicKeys = accessKeys.map((accessKey) => accessKey.public_key);

    const isCodeHashVerified = codeHash === accountCodeHash;
    const isOwnerIdVerified = ownerId === this.coreContract.contractId;
    const isContractStateVerified = contractState.length === 1;
    const isContractStateClear = contractState.length === 0;
    const isAccessKeyVerified = publicKeys.length === 0;

    if (isCodeHashVerified && isOwnerIdVerified && isContractStateVerified && isAccessKeyVerified) {
      // skip
      return;
    }

    const transaction = MultiTransaction.createTransaction(registrantId);

    // deploy controller contract
    transaction.deployContract(code);

    // clean account state if needed
    if (!isContractStateClear) {
      transaction.functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: contractStateKeys,
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gasForCleanState,
      });
    }

    // init controller contract
    transaction.functionCall<InitArgs>({
      methodName: 'init',
      args: Buffer.from(this.getCoreContractId()),
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gasForInit,
    });

    // delete all access keys
    publicKeys.forEach((publicKey) => transaction.deleteKey(publicKey));

    await this.selector.sendWithLocalKey(registrantId, transaction);
  }

  // controller owner id
  async get_owner_id({ registrantId, blockQuery }: GetControllerOwnerIdOptions): Promise<string | undefined> {
    try {
      return await this.selector.view({
        contractId: registrantId,
        methodName: 'get_owner_id',
        blockQuery,
      });
    } catch (e) {
      console.warn(`Get controller owner id failed, registrant id: ${registrantId}, message: ${(e as any).message}`);
      return void 0;
    }
  }
}

export async function initNameSky(config: NameSkyConfig): Promise<NameSky> {
  const { selectorConfig, contractsConfig } = config;
  const selector = await setupWalletSelectorPlus({
    ...selectorConfig,
    keyStorePrefix: selectorConfig.keyStorePrefix ?? REGISTRANT_KEYSTORE_PREFIX,
  });
  const coreContract = new CoreContract(contractsConfig.coreContractId, selector);
  const marketplaceContract = new MarketplaceContract(contractsConfig.marketplaceContractId, selector);
  const userSettingContract = new UserSettingContract(contractsConfig.userSettingContractId, selector);
  return new NameSky({ selector, coreContract, marketplaceContract, userSettingContract });
}
