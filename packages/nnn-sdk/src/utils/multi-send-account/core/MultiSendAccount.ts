import {Account} from "near-api-js";
import {
  BaseArgs,
  MultiTransaction,
  parseOutcomeValue,
  SpecificFunctionViewOptions
} from "../../multi-transaction";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {SignAndSendTransactionsOptions} from "../types";
import {SignAndSendTransactionOptions} from "near-api-js/lib/account";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account {
  // rewrite to make method public
  async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(options)
  }

  async signAndSendTransactions(options: SignAndSendTransactionsOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = []
    for (const transaction of options.transactions) {
      const outcome = await this.signAndSendTransaction(transaction)
      outcomes.push(outcome)
    }
    return outcomes
  }

  async view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: SpecificFunctionViewOptions<Args>): Promise<Value> {
    return this.viewFunction({
      contractId,
      methodName,
      args,
      blockQuery
    })
  }

  async send<Value>(transaction: MultiTransaction): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({transactions: transaction.parseNearApiJsTransactions()})
    return parseOutcomeValue(outcomes.pop()!)
  }
}
