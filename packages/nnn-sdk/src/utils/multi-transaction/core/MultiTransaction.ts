import {TransactionLike} from "../types";
import {ActionFactory} from "./ActionFactory";
import {BaseArgs, FunctionCallOptions} from "../types";
import {AccessKey, ActionLike} from "../types";
import {NearApiJsTransactionLike, NearWalletSelectorTransactionLike, Transform} from "../types";
import {
  parseNearApiJsTransaction,
  parseNearWalletSelectorTransaction
} from "../utils";
import {Amount} from "../utils";
import {Gas} from "../utils";

/**
 * Helper class for creating transaction(s)
 */
export class MultiTransaction implements Transform {
  transactions: TransactionLike[]

  constructor(receiverId: string, signerId?: string) {
    this.transactions = []
    this.nextTransaction(receiverId, signerId)
  }

  private currentIndex(): number {
    return this.transactions.length - 1
  }

  nextTransaction(receiverId: string, signerId?: string): this {
    return this.addTransaction({
      signerId,
      receiverId,
      actions: []
    })
  }

  addTransaction(...transaction: TransactionLike[]): this {
    this.transactions.push(...transaction)
    return this
  }

  addAction(...action: ActionLike[]): this {
    this.transactions[this.currentIndex()].actions.push(...action)
    return this
  }

  createAccount(): this {
    return this.addAction(ActionFactory.createAccount())
  }

  deleteAccount(beneficiaryId: string): this {
    return this.addAction(ActionFactory.deleteAccount({beneficiaryId}))
  }

  addKey(
    publicKey: string,
    accessKey: AccessKey
  ): this {
    return this.addAction(ActionFactory.addKey({publicKey, accessKey}))
  }

  deleteKey(publicKey: string): this {
    return  this.addAction(ActionFactory.deleteKey({publicKey}))
  }

  deployContract(code: Uint8Array): this {
    return this.addAction(ActionFactory.deployContract({code}))
  }

  stake(amount: string, publicKey: string): this {
    return this.addAction(ActionFactory.stake({amount, publicKey}))
  }

  functionCall<Args extends BaseArgs>({
    methodName,
    args,
    attachedDeposit,
    gas
  }: FunctionCallOptions<Args>): this {
    return this.addAction(ActionFactory.functionCall({
      methodName,
      args,
      attachedDeposit: attachedDeposit ?? Amount.ZERO,
      gas: gas ?? Gas.DEFAULT
    }))
  }

  transfer(amount: string): this {
    return this.addAction(ActionFactory.transfer({amount}))
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0
  }

  static fromTransactions(...transactions: TransactionLike[]): MultiTransaction {
    if (transactions.length === 0) {
      throw Error('Bad transaction(s)')
    }
    let multiTransaction: MultiTransaction
    transactions.forEach((transaction, index) => {
      if (index === 0) {
        const {signerId, receiverId, actions} = transaction
        multiTransaction = new MultiTransaction(receiverId, signerId).addAction(...actions)
      } else {
        multiTransaction.addTransaction(transaction)
      }
    })
    return multiTransaction!
  }

  toTransactions(): TransactionLike[] {
    return [...this.transactions]
  }

  parseNearApiJsTransactions(): NearApiJsTransactionLike[] {
    const transactions = this.toTransactions()
    return transactions.map(transaction => {
      return parseNearApiJsTransaction(transaction)
    })
  }

  parseNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    const transactions = this.toTransactions()
    return transactions.map(transaction => {
      return parseNearWalletSelectorTransaction(transaction)
    })
  }
}
