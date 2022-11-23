import {Account} from "near-api-js";
import {parseOutcomeValue} from "../../multi-transaction/utils/outcome";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {MultiSendOptions, SignAndSendTransactionParams, SignAndSendTransactionsParams} from "../types/common";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account {
  async signAndSendTransaction(params: SignAndSendTransactionParams): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(params)
  }

  async signAndSendTransactions({transactions}: SignAndSendTransactionsParams): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = []
    for (const signAndSendTransactionParams of transactions) {
      const outcome = await this.signAndSendTransaction(signAndSendTransactionParams)
      outcomes.push(outcome)
    }
    return outcomes
  }

  async multiSend<Value>({transaction}: MultiSendOptions): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({ transactions: transaction.parseNearApiJsTransactions() })
    return parseOutcomeValue(outcomes.pop()!)
  }
}
