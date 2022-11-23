import {TransactionLike} from "../types/transaction";
import {ActionFactory} from "./ActionFactory";
import {BaseArgs, FunctionCallOptions, ReceiverIdOrOptions} from "../types/common";
import {AccessKey, ActionLike} from "../types/action";
import {NearApiJsTransactionLike, NearWalletSelectorTransactionLike, Transform} from "../types/transform";
import {
  parseNearApiJsTransaction,
  parseNearWalletSelectorTransaction
} from "../utils/transform";
import {Amount} from "../utils/Amount";
import {Gas} from "../utils/Gas";

/**
 * Hepler class for quickly creating transaction(s)
 */
export class NearTransaction implements Transform {
  private readonly transactions: TransactionLike[]

  constructor(receiverIdOrOptions: ReceiverIdOrOptions) {
    this.transactions = []
    this.nextTransaction(receiverIdOrOptions)
  }

  private currentIndex(): number {
    return this.transactions.length - 1
  }

  nextTransaction(receiverIdOrOptions: ReceiverIdOrOptions): this {
    let signerId: string | undefined
    let receiverId: string
    if (typeof receiverIdOrOptions === 'string') {
      receiverId = receiverIdOrOptions
    } else {
      signerId = receiverIdOrOptions.signerId
      receiverId = receiverIdOrOptions.receiverId
    }
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
      args: args ?? {},
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

  static fromTransactions(...transactions: TransactionLike[]): NearTransaction {
    if (transactions.length === 0) {
      throw Error('Bad transaction(s)')
    }
    let nearTransaction: NearTransaction
    transactions.forEach((transaction, index) => {
      if (index === 0) {
        const {signerId, receiverId, actions} = transaction
        nearTransaction = new NearTransaction({signerId, receiverId}).addAction(...actions)
      } else {
        nearTransaction.addTransaction(transaction)
      }
    })
    return nearTransaction!
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
