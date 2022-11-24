import {Modify} from "@near-wallet-selector/core/lib/utils.types";
import {WalletSelector} from "@near-wallet-selector/core";
import {Near} from "near-api-js";
import {MultiSendOptions} from "./common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs, MultiTransaction, SpecificFunctionViewOptions} from "../../multi-transaction";
import {MultiSenderAccount} from "../../multi-sender-account";

export interface WalletSelectorEnhancement {
  near: Near;
  getActiveAccountId(): string | undefined;
  getAccountIds(): string[];
  keyStore(): BrowserLocalStorageKeyStore;
  multiSenderAccount(accountId: string): MultiSenderAccount;
  view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: SpecificFunctionViewOptions<Args>): Promise<Value>;
  multiSend<Value>(transaction: MultiTransaction, options?: MultiSendOptions): Promise<Value>;
  multiSendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value>
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>
