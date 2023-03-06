import { setupWalletSelector } from '@near-wallet-selector/core';
import { resolveNetwork } from '../utils';
import { InMemorySigner, keyStores, Near } from 'near-api-js';
import { WalletSelectorPlusConfig, WalletSelectorPlus } from '../types';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import {
  Amount,
  FunctionViewOptions,
  MethodArgs,
  MultiTransaction,
  throwReceiptsErrorIfAny,
} from '../../multi-transaction';
import { parseOutcomeValue } from '../../multi-transaction';
import { MultiSendAccount } from '../../multi-send-account';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { WalletSelectorPlusSendOptions } from '../types';
import { PublicKey } from 'near-api-js/lib/utils';

let walletSelectorPlus: WalletSelectorPlus | null = null;

export async function setupWalletSelectorPlus(config: WalletSelectorPlusConfig): Promise<WalletSelectorPlus> {
  if (!walletSelectorPlus) {
    const selector = await setupWalletSelector({ ...config });

    const near = new Near({
      ...resolveNetwork(config.network),
      keyStore: new keyStores.BrowserLocalStorageKeyStore(localStorage, config.keyStorePrefix),
    });

    walletSelectorPlus = {
      ...selector,
      near,

      getViewer(): MultiSendAccount {
        if (!this.viewer) {
          this.viewer = this.multiSendAccount('');
        }
        return this.viewer;
      },

      getActiveAccountId(): string | undefined {
        return this.store.getState().accounts.find((accountState) => accountState.active)?.accountId;
      },

      getAccountIds(): string[] {
        return this.store.getState().accounts.map((accountState) => accountState.accountId);
      },

      keyStore(): BrowserLocalStorageKeyStore {
        return (this.near.connection.signer as InMemorySigner).keyStore as BrowserLocalStorageKeyStore;
      },

      multiSendAccount(accountId: string): MultiSendAccount {
        return new MultiSendAccount(this.near.connection, accountId);
      },

      async view<Value, Args extends MethodArgs>(options: FunctionViewOptions<Value, Args>): Promise<Value> {
        return this.getViewer().view<Value, Args>(options);
      },

      async send<Value>(transaction: MultiTransaction, options?: WalletSelectorPlusSendOptions<Value>): Promise<Value> {
        const wallet = await this.wallet(options?.walletId);
        const nearWalletSelectorTransactions = transaction.toNearWalletSelectorTransactions();
        let outcomes: FinalExecutionOutcome[];
        if (transaction.isMultiple()) {
          outcomes = (await wallet.signAndSendTransactions({
            transactions: nearWalletSelectorTransactions,
            callbackUrl: options?.callbackUrl,
          })) as FinalExecutionOutcome[];
        } else {
          const outcome = (await wallet.signAndSendTransaction({
            ...nearWalletSelectorTransactions[0],
            callbackUrl: options?.callbackUrl,
          })) as FinalExecutionOutcome;
          outcomes = [outcome];
        }
        if (options?.throwReceiptsErrorIfAny) {
          outcomes.forEach((outcome) => throwReceiptsErrorIfAny(outcome));
        }
        return parseOutcomeValue<Value>(outcomes.pop()!, options?.parse)!;
      },

      async sendWithLocalKey<Value>(signerID: string, transaction: MultiTransaction): Promise<Value> {
        return this.multiSendAccount(signerID).send<Value>(transaction);
      },

      async isLoginAccessKeyActive(accountId?: string): Promise<boolean> {
        accountId = accountId ?? this.getActiveAccountId();
        if (!accountId) {
          return false;
        }

        const loginAccount = await this.wallet()
          .then((wallet) => wallet.getAccounts())
          .then((accounts) => accounts.find((account) => account.accountId === accountId));
        const loginPublicKey = loginAccount?.publicKey;

        if (!loginPublicKey) {
          return false;
        }

        const accessKeys = await this.multiSendAccount(accountId).getAccessKeys();
        const loginAccessKey = accessKeys.find(
          (accessKey) =>
            PublicKey.fromString(accessKey.public_key).toString() === PublicKey.fromString(loginPublicKey).toString()
        );

        if (!loginAccessKey) {
          return false;
        }

        if (loginAccessKey.access_key.permission === 'FullAccess') {
          return true;
        }

        const remainingAllowance = Amount.new(loginAccessKey.access_key.permission.FunctionCall.allowance);
        return remainingAllowance.gte(Amount.parseYoctoNear('0.05'));
      },
    };
  }

  return walletSelectorPlus;
}
