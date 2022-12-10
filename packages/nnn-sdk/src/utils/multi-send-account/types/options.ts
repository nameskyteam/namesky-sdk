import { NearApiJsTransactionLike } from '../../multi-transaction';

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

export interface MultiSendAccountSendOptions {
  throwReceiptsErrorIfAny?: boolean;
}
