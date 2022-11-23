import {Modify} from "@near-wallet-selector/core/lib/utils.types";
import {WalletSelector} from "@near-wallet-selector/core";
import {Near} from "near-api-js";
import {ViewOptions} from "./common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs, MultiTransaction} from "../../multi-transaction";
import {MultiSendAccount} from "../../multi-send-account";

export interface WalletSelectorEnhancement {
  near: Near;
  currentAccountId(): string | undefined;
  getKeyStoredAccount(accountId: string): MultiSendAccount;
  keyStore(): BrowserLocalStorageKeyStore;
  view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: ViewOptions<Args>): Promise<Value>;
  multiSend<Value>(transaction: MultiTransaction, callbackUrl?: string): Promise<Value>;
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>
