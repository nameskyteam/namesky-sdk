import {Action} from "@near-wallet-selector/core";
import {Transaction} from "../types/transaction";
import {ActionFactory} from "./ActionFactory";
import {FunctionCall} from "../types/action";
import {AddKeyPermission} from "@near-wallet-selector/core/lib/wallet/transactions.types";
import {BaseArgs} from "../types/common";

export class NearTransaction {
  private readonly transactions: Transaction[]

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

  addTransaction(...transaction: Transaction[]): this {
    this.transactions.push(...transaction)
    return this
  }

  addAction(...action: Action[]): this {
    this.transactions[this.currentIndex()].actions.push(...action)
    return this
  }

  transfer(amount: string): this {
    return this.addAction(ActionFactory.transfer({amount}))
  }

  functionCall<Args extends BaseArgs>(
    _: FunctionCall<Args>
  ): this {
    return this.addAction(ActionFactory.functionCall(_))
  }

  deployContract(code: Uint8Array): this {
    return this.addAction(ActionFactory.deployContract({code}))
  }

  stake(amount: string, publicKey: string): this {
    return this.addAction(ActionFactory.stake({amount, publicKey}))
  }

  createAccount(): this {
    return this.addAction(ActionFactory.createAccount())
  }

  deleteAccount(beneficiaryId: string): this {
    return this.addAction(ActionFactory.deleteAccount({beneficiaryId}))
  }

  addKey(
    publicKey: string,
    permission: AddKeyPermission,
    nonce?: number
  ): this {
    return this.addAction(ActionFactory.addKey({publicKey, permission, nonce}))
  }

  deleteKey(publicKey: string): this {
    return  this.addAction(ActionFactory.deleteKey({publicKey}))
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0
  }

  toTransactions(): Transaction[] {
    return this.transactions
  }

  toTransaction(): Transaction {
    if (this.isMultiple()) {
      throw Error('Multiple transactions in NearTransaction')
    }
    return this.toTransactions()[0]
  }

  static fromTransaction(...transactions: Transaction[]): NearTransaction {
    if (transactions.length === 0) {
      throw Error('Transaction not found')
    }
    let nearTransaction: NearTransaction
    transactions.forEach((transaction, index) => {
      if (index === 0) {
        const {signerId, receiverId, actions} = transaction
        nearTransaction = new NearTransaction(receiverId, signerId).addAction(...actions)
      } else {
        nearTransaction.addTransaction(transaction)
      }
    })
    return nearTransaction!
  }
}
