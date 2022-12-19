import { NearApiJsTransactionLike, ResponseParser } from '../../multi-transaction';

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

export interface MultiSendAccountSendOptions<Value> {
  throwReceiptsErrorIfAny?: boolean;
  parse: ResponseParser<Value>;
}
