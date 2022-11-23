import {setupWalletSelector} from "@near-wallet-selector/core";
import {resolveNetwork, setupWalletModules} from "../utils/common";
import {InMemorySigner, keyStores, Near} from "near-api-js";
import {MultiSendOptions, ViewOptions} from "../types/common";
import {WalletSelectorPlusConfig} from "../types/config";
import {WalletSelectorPlus} from "../types/enhancement";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs} from "../../multi-transaction/types/common";
import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";
import {MultiSendAccount} from "../../multi-send-account/core/MultiSendAccount";
import {parseOutcomeValue} from "../../multi-transaction/utils/outcome";

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

      async multiSend<Value>({transaction, callbackUrl}: MultiSendOptions): Promise<Value> {
        const wallet = await this.wallet()
        const nearWalletSelectorTransactions = transaction.parseNearWalletSelectorTransactions()
        let outcome = null
        if (transaction.isMultiple()) {
          const outcomes = await wallet.signAndSendTransactions({transactions: nearWalletSelectorTransactions , callbackUrl})
          outcome = outcomes!.pop()
        } else {
          outcome = await wallet.signAndSendTransaction({...nearWalletSelectorTransactions[0], callbackUrl})
        }
        return parseOutcomeValue(outcome!)
      },

      async multiSendWithLocalKey<Value>(localSignerId: string, transaction: MultiTransaction): Promise<Value> {
        const account = new MultiSendAccount(this.near.connection, localSignerId)
        return account.multiSend({transaction})
      }
    }
  }

  return walletSelectorPlus
}
