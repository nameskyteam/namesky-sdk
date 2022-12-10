import { setupWalletSelector } from '@near-wallet-selector/core';
import { resolveNetwork, setupWalletModules } from '../utils';
import { InMemorySigner, keyStores, Near } from 'near-api-js';
import { WalletSelectorPlusConfig, WalletSelectorPlus } from '../types';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { BaseArgs, FunctionViewOptions, MultiTransaction, throwReceiptsErrorIfAny } from '../../multi-transaction';
import { parseOutcomeValue } from '../../multi-transaction';
import { MultiSendAccount } from '../../multi-send-account';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { WalletSelectorPlusSendOptions } from '../types';

let walletSelectorPlus: WalletSelectorPlus | null = null;

export async function setupWalletSelectorPlus(config: WalletSelectorPlusConfig): Promise<WalletSelectorPlus> {
  if (!walletSelectorPlus) {
    const selector = await setupWalletSelector({
      ...config,
      modules: setupWalletModules(config.modules),
    });

    const near = new Near({
      ...resolveNetwork(config.network),
      keyStore: new keyStores.BrowserLocalStorageKeyStore(localStorage, config.keyStorePrefix),
    });

    walletSelectorPlus = {
      ...selector,
      near,

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

      async view<Value, Args extends BaseArgs>(options: FunctionViewOptions<Args>): Promise<Value> {
        return this.multiSendAccount('').view(options);
      },

      async send<Value>(transaction: MultiTransaction, options?: WalletSelectorPlusSendOptions): Promise<Value> {
        const wallet = await this.wallet(options?.walletId);
        const nearWalletSelectorTransactions = transaction.parseNearWalletSelectorTransactions();
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
        return parseOutcomeValue(outcomes.pop()!);
      },

      async sendWithLocalKey<Value>(signerID: string, transaction: MultiTransaction): Promise<Value> {
        return this.multiSendAccount(signerID).send(transaction);
      },
    };
  }

  return walletSelectorPlus;
}
