import {Modify} from "@near-wallet-selector/core/lib/utils.types";
import {WalletSelector} from "@near-wallet-selector/core";
import {Near} from "near-api-js";
import {MultiSendOptions, ViewOptions} from "./common";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs} from "../../multi-transaction/types/common";
import {MultiTransaction} from "../../multi-transaction/core/MultiTransaction";

export interface WalletSelectorEnhancement {
  near: Near;
  getAccountId(): string | undefined;
  getKeyStore(): BrowserLocalStorageKeyStore;
  view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: ViewOptions<Args>): Promise<Value>;
  multiSend<Value>(options: MultiSendOptions): Promise<Value>;
  multiSendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value>;
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>
