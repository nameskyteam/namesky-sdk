import {Modify} from "@near-wallet-selector/core/lib/utils.types";
import {WalletSelector} from "@near-wallet-selector/core";
import {Near} from "near-api-js";
import {SelectorMultiSendOptions, SelectorFunctionViewOptions} from "./common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs, MultiTransaction} from "../../multi-transaction";
import {MultiSendAccount} from "../../multi-send-account";

export interface WalletSelectorEnhancement {
  near: Near;
  getActiveAccountId(): string | undefined;
  getAccountIds(): string[];
  keyStore(): BrowserLocalStorageKeyStore;
  multiSendAccount(accountId: string): MultiSendAccount;
  view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: SelectorFunctionViewOptions<Args>): Promise<Value>;
  multiSend<Value>(transaction: MultiTransaction, options?: SelectorMultiSendOptions): Promise<Value>;
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>
