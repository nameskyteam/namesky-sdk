import {setupWalletSelector} from "@near-wallet-selector/core";
import {resolveNetwork, setupWalletModules} from "../utils";
import {InMemorySigner, keyStores, Near} from "near-api-js";
import {ViewOptions ,WalletSelectorPlusConfig, WalletSelectorPlus} from "../types";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs} from "../../multi-transaction";
import {parseOutcomeValue} from "../../multi-transaction";
import {MultiSendAccount} from "../../multi-send-account";
import {MultiSendOptions, MultiSendWithLocalKeyOptions} from "../types/common";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";

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
        let outcome
        if (transaction.isMultiple()) {
          const outcomes = await wallet.signAndSendTransactions({transactions: nearWalletSelectorTransactions , callbackUrl})
          outcome = (outcomes as FinalExecutionOutcome[]).pop()
        } else {
          outcome = await wallet.signAndSendTransaction({...nearWalletSelectorTransactions[0], callbackUrl})
          outcome = outcome as FinalExecutionOutcome
        }
        return parseOutcomeValue(outcome!)
      },

      async multiSendWithLocalKey<Value>({localSignerId, transaction}: MultiSendWithLocalKeyOptions): Promise<Value> {
        const account = new MultiSendAccount(this.near.connection, localSignerId)
        return account.multiSend({transaction})
      }
    }
  }

  return walletSelectorPlus
}
