import { ACTION_MAX_NUM, moveRegistrantPublicKeyToEnd, REGISTRANT_KEYSTORE_PREFIX } from '../utils';
import { CoreContract } from './contracts';
import { MarketplaceContract } from './contracts';
import { KeyPairEd25519, PublicKey } from 'near-api-js/lib/utils';
import { REQUEST_ACCESS_PENDING_KEY_PREFIX } from '../utils';
import { Network } from '@near-wallet-selector/core';
import { NameSkyComponent, NameSkyConfig } from './types/config';
import { Account } from 'near-api-js';
import { CleanStateArgs, InitArgs } from './types/args';
import { GetControllerOwnerIdOptions, SetupControllerOptions } from './types/options';
import { UserSettingContract } from './contracts/UserSettingContract';
import { getBase58CodeHash } from '../utils';
import {
  Amount,
  BlockQuery,
  MultiSendWalletSelector,
  MultiTransaction,
  setupMultiSendWalletSelector,
} from 'multi-transaction';
import { Provider } from 'near-api-js/lib/providers';
import { AccessKeyList, AccountView } from 'near-api-js/lib/providers/provider';
import { NameSkyNFTSafety } from './types/data';
import * as borsh from 'borsh';
import { Buffer } from 'buffer';
import { Schema } from 'inspector';

export class NameSky {
  selector: MultiSendWalletSelector;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;

  constructor({ selector, coreContract, marketplaceContract, userSettingContract }: NameSkyComponent) {
    this.selector = selector;
    this.coreContract = coreContract;
    this.marketplaceContract = marketplaceContract;
    this.userSettingContract = userSettingContract;

    this.onRequestFullAccess().catch((reason) => console.error('onRequestFullAccess Failed', reason));
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

  getUserSettingContractId(): string {
    return this.userSettingContract.contractId;
  }

  account(accountId: string): Promise<Account> {
    return this.selector.near.account(accountId);
  }

  rpc(): Provider {
    return this.selector.near.connection.provider;
  }

  async requestFullAccess(webWalletBaseUrl: string, successUrl?: string, failureUrl?: string) {
    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.getPublicKey().toString();
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + publicKey;
    const keystore = this.selector.keyStore;
    const networkId = this.getNetworkId();
    await keystore.setKey(networkId, pendingAccountId, keyPair);
    const newUrl = new URL(webWalletBaseUrl + '/login/');
    newUrl.searchParams.set('public_key', publicKey);
    newUrl.searchParams.set('success_url', successUrl ?? window.location.href);
    newUrl.searchParams.set('failure_url', failureUrl ?? window.location.href);
    window.location.assign(newUrl.toString());
  }

  // auto callback
  private async onRequestFullAccess(): Promise<void> {
    const currentUrl = new URL(window.location.href);
    const publicKey = currentUrl.searchParams.get('public_key');
    const accountId = currentUrl.searchParams.get('account_id');
    if (!publicKey || !accountId) {
      return;
    }
    const pendingAccountId = REQUEST_ACCESS_PENDING_KEY_PREFIX + PublicKey.fromString(publicKey).toString();
    const keystore = this.selector.keyStore;
    const networkId = this.getNetworkId();
    const keyPair = await keystore.getKey(networkId, pendingAccountId);
    if (!keyPair) {
      return;
    }
    await keystore.setKey(networkId, accountId, keyPair);
    await keystore.removeKey(networkId, pendingAccountId);
    console.log(`onRequestFullAccess Succeeded`);
  }

  // signed by registrant
  async setupController({ registrantId, code, gasForCleanState, gasForInit }: SetupControllerOptions) {
    /*
      We don't need to check follow conditions at the same block,
      because these are only used to check whether to skip `setupController`
    */
    const account = await this.account(registrantId);

    // code hash
    const accountView = await account.state();
    const accountCodeHash = accountView.code_hash;
    const codeHash = getBase58CodeHash(code);

    // controller owner id
    const controllerOwnerId = await this.getControllerOwnerId({ accountId: registrantId });

    // state
    const state = await account.viewState('');

    // access keys
    const accessKeys = await account.getAccessKeys();

    const isCodeHashVerified = accountCodeHash === codeHash;
    const isControllerOwnerIdVerified = controllerOwnerId === this.coreContract.contractId;
    const isStateVerified = state.length === 1;
    const isAccessKeysVerified = accessKeys.length === 0;

    if (isCodeHashVerified && isControllerOwnerIdVerified && isStateVerified && isAccessKeysVerified) {
      // skip
      return;
    }

    const transaction = MultiTransaction.batch(registrantId);

    // deploy controller contract
    transaction.deployContract(code);

    // clean account state if needed
    if (state.length !== 0) {
      const stateKeys = state.map(({ key }) => key);
      transaction.functionCall<CleanStateArgs>({
        methodName: 'clean_state',
        args: stateKeys,
        stringify: (stateKeys) => {
          // borsh serialize `[Vec<u8>; len]`
          const schema: borsh.Schema = { array: { type: { array: { type: 'u8' } }, len: stateKeys.length } };
          return Buffer.from(borsh.serialize(schema, stateKeys));
        },
        attachedDeposit: Amount.oneYocto(),
        gas: gasForCleanState,
      });
    }

    // init controller contract
    transaction.functionCall<InitArgs>({
      methodName: 'init',
      args: Buffer.from(this.getCoreContractId()), // raw args
      attachedDeposit: Amount.oneYocto(),
      gas: gasForInit,
    });

    // delete all access keys
    const keyPair = await this.selector.keyStore.getKey(this.getNetworkId(), registrantId);

    if (!keyPair) {
      throw Error(`No access key found locally for Account(${registrantId}) to sign transaction.`);
    }

    const registrantPublicKey = keyPair.getPublicKey().toString();
    let publicKeys = accessKeys.map((accessKey) => accessKey.public_key);
    publicKeys = moveRegistrantPublicKeyToEnd(registrantPublicKey, publicKeys);

    for (const publicKey of publicKeys) {
      if (transaction.countActions() < ACTION_MAX_NUM) {
        transaction.deleteKey(publicKey);
      } else {
        transaction.batch(registrantId).deleteKey(publicKey);
      }
    }

    await this.selector.sendWithLocalKey(registrantId, transaction);
    await this.selector.keyStore.removeKey(this.getNetworkId(), registrantId);
    console.log(`Removed local full access key, registrant id: ${registrantId}`);
  }

  async getNFTAccountSafety(accountId: string): Promise<NameSkyNFTSafety> {
    /*
      We need to check follow conditions at the same block for account security reason
    */
    const {
      header: { height },
    } = await this.rpc().block({ finality: 'optimistic' });

    const blockQuery: BlockQuery = { blockId: height };

    const [codeHash, controllerCodeViews, controllerOwnerId, state, { keys: accessKeys }] = await Promise.all([
      this.rpc()
        .query<AccountView>({
          ...blockQuery,
          request_type: 'view_account',
          account_id: accountId,
        })
        .then((accountView) => accountView.code_hash),

      this.coreContract.get_controller_code_views({ blockQuery }),

      this.getControllerOwnerId({
        accountId,
        blockQuery,
      }),

      this.account(accountId).then((account) => account.viewState('', blockQuery)),

      this.rpc().query<AccessKeyList>({
        ...blockQuery,
        request_type: 'view_access_key_list',
        account_id: accountId,
      }),
    ]);

    const isCodeHashCorrect = controllerCodeViews.some((view) => view.code_hash === codeHash);
    const isControllerOwnerIdCorrect = controllerOwnerId === this.coreContract.contractId;
    const isStateCleaned = state.length === 1; // Only one state key left which save the controller owner id
    const isAccessKeysDeleted = accessKeys.length === 0;

    return { isCodeHashCorrect, isControllerOwnerIdCorrect, isStateCleaned, isAccessKeysDeleted };
  }

  async getControllerOwnerId({ accountId, blockQuery }: GetControllerOwnerIdOptions): Promise<string | undefined> {
    try {
      return await this.selector.view({
        contractId: accountId,
        methodName: 'get_owner_id',
        blockQuery,
      });
    } catch (e: any) {
      console.warn(`Account(${accountId}) is not NameSky NFT yet`);
      return undefined;
    }
  }
}

export async function initNameSky(config: NameSkyConfig): Promise<NameSky> {
  const { selectorConfig, contractsConfig } = config;
  const selector = await setupMultiSendWalletSelector({
    ...selectorConfig,
    keyStorePrefix: selectorConfig.keyStorePrefix ?? REGISTRANT_KEYSTORE_PREFIX,
  });
  const coreContract = new CoreContract(contractsConfig.coreContractId, selector);
  const marketplaceContract = new MarketplaceContract(contractsConfig.marketplaceContractId, selector);
  const userSettingContract = new UserSettingContract(contractsConfig.userSettingContractId, selector);
  return new NameSky({ selector, coreContract, marketplaceContract, userSettingContract });
}
