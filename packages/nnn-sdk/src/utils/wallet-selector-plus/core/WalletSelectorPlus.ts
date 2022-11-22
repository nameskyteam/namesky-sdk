import {setupWalletSelector} from "@near-wallet-selector/core";
import {parseOutcomeValue, resolveNetwork, setupWalletModules} from "../utils/common";
import {InMemorySigner, keyStores, Near} from "near-api-js";
import {ViewOptions} from "../types/common";
import {WalletSelectorPlusConfig} from "../types/config";
import {WalletSelectorPlus} from "../types/enhancement";
import {MultiSendAccount} from "../types/common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs} from "../../near-transaction/types/common";
import {NearTransaction} from "../../near-transaction/core/NearTransaction";

let walletSelectorPlus: WalletSelectorPlus | null = null;

/**
 * Enhancement of `NearWalletSelector` based on `NearTransaction`
 *
 * @param config
 */
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
        const nearWalletSelectorTransactions = transaction.toNearWalletSelectorTransactions()
        let outcome = null
        if (transaction.isMultiple()) {
          const outcomes = await wallet.signAndSendTransactions({transactions: nearWalletSelectorTransactions , callbackUrl})
          outcome = outcomes!.pop()
        } else {
          outcome = await wallet.signAndSendTransaction({...nearWalletSelectorTransactions[0], callbackUrl})
        }
        return parseOutcomeValue(outcome!)
      },

      async sendWithLocalKey<Value>(signerId: string, transaction: NearTransaction): Promise<Value> {
        const account = (await this.near.account(signerId)) as unknown as MultiSendAccount
        let outcome = null
        for (const nearApiJsTransaction of transaction.toNearApiJsTransactions()) {
          outcome = await account.signAndSendTransaction(nearApiJsTransaction)
        }
        return parseOutcomeValue(outcome!)
      }
    }
  }

  return walletSelectorPlus
}
