import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { WalletSelectorPlusSendOptions } from './options';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { FunctionViewOptions, MethodArgs, MultiTransaction } from '../../multi-transaction';
import { MultiSendAccount } from '../../multi-send-account';

export interface WalletSelectorEnhancement {
  near: Near;
  viewer?: MultiSendAccount;
  getViewer(): MultiSendAccount;
  getActiveAccountId(): string | undefined;
  getAccountIds(): string[];
  keyStore(): BrowserLocalStorageKeyStore;
  multiSendAccount(accountId: string): MultiSendAccount;
  view<Value, Args extends MethodArgs>({
    contractId,
    methodName,
    args,
    blockQuery,
  }: FunctionViewOptions<Value, Args>): Promise<Value>;
  send<Value>(transaction: MultiTransaction, options?: WalletSelectorPlusSendOptions<Value>): Promise<Value>;
  sendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value>;
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>;
