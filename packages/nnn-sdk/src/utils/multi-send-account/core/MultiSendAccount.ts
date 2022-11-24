import {Account} from "near-api-js";
import {BaseArgs, MultiTransaction, parseOutcomeValue} from "../../multi-transaction";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {
  SignAndSendTransactionParams,
  SignAndSendTransactionsParams,
  AccountFunctionViewOptions
} from "../types";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account {
  async signAndSendTransaction(params: SignAndSendTransactionParams): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(params)
  }

  async signAndSendTransactions(params: SignAndSendTransactionsParams): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = []
    for (const signAndSendTransactionParams of params.transactions) {
      const outcome = await this.signAndSendTransaction(signAndSendTransactionParams)
      outcomes.push(outcome)
    }
    return outcomes
  }

  async view<Value, Args extends BaseArgs>({contractId, methodName, args, blockQuery}: AccountFunctionViewOptions<Args>): Promise<Value> {
    return this.viewFunction({
      contractId,
      methodName,
      args,
      blockQuery
    })
  }

  async multiSend<Value>(transaction: MultiTransaction): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({ transactions: transaction.parseNearApiJsTransactions() })
    return parseOutcomeValue(outcomes.pop()!)
  }
}
