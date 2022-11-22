import {setupWalletSelector} from "@near-wallet-selector/core";
import {parseOutcomeValue, resolveNetwork, setupWalletModules, transformAction} from "./utils/common";
import {InMemorySigner, keyStores, Near} from "near-api-js";
import {ViewOptions} from "./types/options";
import {NearTransaction} from "./core/NearTransaction";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {WalletSelectorPlusConfig} from "./types/config";
import {WalletSelectorPlus} from "./types/enhancement";
import {BaseArgs, MultiSendAccount} from "./types/common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";

let walletSelectorPlus: WalletSelectorPlus | null = null;

export async function setupWalletSelectorPlus(config: WalletSelectorPlusConfig): Promise<WalletSelectorPlus> {
  if (!walletSelectorPlus) {
    const selector = await setupWalletSelector({
      ...config,
      modules: setupWalletModules(config.modules)
    })

    const near = new Near({
      ...resolveNetwork(config.network),
      keyStore: new keyStores.BrowserLocalStorageKeyStore(
        localStorage,
        config.keyStorePrefix
      )})

    walletSelectorPlus = {
      ...selector,
      near,

      getAccountId(): string | undefined {
        return this.store.getState().accounts.find(accountState => accountState.active)?.accountId
      },

      getKeyStore(): BrowserLocalStorageKeyStore {
        return (this.near.connection.signer as InMemorySigner).keyStore as BrowserLocalStorageKeyStore
      },

      async view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: ViewOptions<Args>): Promise<Value> {
        const viewer = await this.near.account('')
        return viewer.viewFunctionV2({
          contractId,
          methodName,
          args: args ?? {},
          blockQuery
        })
      },

      async send<Value>(transaction: NearTransaction, callbackUrl?: string): Promise<Value> {
        const wallet = await this.wallet()
        let outcome
        if (transaction.isMultiple()) {
          const outcomes = await wallet.signAndSendTransactions({transactions: transaction.toTransactions(), callbackUrl})
          outcome = outcomes!.pop()
        } else {
          outcome = await wallet.signAndSendTransaction({...transaction.toTransaction(), callbackUrl})
        }
        return parseOutcomeValue(outcome!)
      },

      async sendWithLocalKey<Value>(signerId: string, transaction: NearTransaction): Promise<Value> {
        const account = (await this.near.account(signerId)) as unknown as MultiSendAccount
        const outcomes: FinalExecutionOutcome[] = []
        for (const {receiverId, actions} of transaction.toTransactions()) {
          const outcome = await account.signAndSendTransaction({
            receiverId,
            actions: actions.map(action => transformAction(action))
          })
          outcomes.push(outcome)
        }
        return parseOutcomeValue(outcomes.pop()!)
      }
    }
  }

  return walletSelectorPlus
}
