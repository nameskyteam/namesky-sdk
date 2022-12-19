import { ResponseParser } from '../../multi-transaction';

export interface WalletSelectorPlusSendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
  throwReceiptsErrorIfAny?: boolean;
  parse?: ResponseParser<Value>;
}
