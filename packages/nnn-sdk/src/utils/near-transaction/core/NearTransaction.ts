import {TransactionLike} from "../types/transaction";
import {ActionFactory} from "./ActionFactory";
import {FunctionCallOptions, BaseArgs, ReceiverIdOrOptions} from "../types/options";
import {AccessKeyPermission, ActionLike} from "../types/action";
import {NearApiJsTransactionLike, NearWalletSelectorTransactionLike} from "../types/transform";
import {
  parseNearApiJsTransaction,
  parseNearWalletSelectorTransaction
} from "../utils/transform";

export class NearTransaction {
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
    permission: AccessKeyPermission,
    nonce?: number
  ): this {
    return this.addAction(ActionFactory.addKey({publicKey, permission, nonce}))
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

  functionCall<Args extends BaseArgs>(
    options: FunctionCallOptions<Args>
  ): this {
    return this.addAction(ActionFactory.functionCall(options))
  }

  transfer(amount: string): this {
    return this.addAction(ActionFactory.transfer({amount}))
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0
  }

  toTransactions(): TransactionLike[] {
    return this.transactions
  }

  toNearApiJsTransactions(): NearApiJsTransactionLike[] {
    const transactions = this.toTransactions()
    return transactions.map(transaction => {
      return parseNearApiJsTransaction(transaction)
    })
  }

  toNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    const transactions = this.toTransactions()
    return transactions.map(transaction => {
      return parseNearWalletSelectorTransaction(transaction)
    })
  }

  static fromTransactions(...transactions: TransactionLike[]): NearTransaction {
    if (transactions.length === 0) {
      throw Error('Transaction not found')
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
}
