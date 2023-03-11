import { ValueParser } from 'multi-transaction';

export interface WalletSelectorPlusSendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}
