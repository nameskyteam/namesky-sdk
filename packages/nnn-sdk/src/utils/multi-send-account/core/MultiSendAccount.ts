import { Account } from 'near-api-js';
import {
  BaseArgs,
  MultiTransaction,
  parseOutcomeValue,
  SpecificFunctionViewOptions,
  throwReceiptsErrorIfAny,
} from '../../multi-transaction';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { SignAndSendTransactionsOptions } from '../types';
import { SignAndSendTransactionOptions } from 'near-api-js/lib/account';
import { MultiSendAccountSendOptions } from '../types';

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account {
  // rewrite to make method public
  async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(options);
  }

  async signAndSendTransactions(options: SignAndSendTransactionsOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];
    for (const transaction of options.transactions) {
      const outcome = await this.signAndSendTransaction(transaction);
      outcomes.push(outcome);
    }
    return outcomes;
  }

  async view<Value, Args extends BaseArgs>({
    contractId,
    methodName,
    args,
    blockQuery,
  }: SpecificFunctionViewOptions<Args>): Promise<Value> {
    return this.viewFunction({
      contractId,
      methodName,
      args,
      blockQuery,
    });
  }

  async send<Value>(transaction: MultiTransaction, options?: MultiSendAccountSendOptions): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({
      transactions: transaction.parseNearApiJsTransactions(),
    });
    if (options?.throwReceiptsErrorIfAny) {
      outcomes.forEach((outcome) => throwReceiptsErrorIfAny(outcome));
    }
    return parseOutcomeValue(outcomes.pop()!);
  }
}
