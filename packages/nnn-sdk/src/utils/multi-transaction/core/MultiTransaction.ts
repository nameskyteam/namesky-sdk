import {
  FtTransferArgs,
  FtTransferCallArgs,
  NftApproveArgs,
  NftRevokeAllArgs,
  NftRevokeArgs,
  NftTransferArgs,
  NftTransferCallArgs,
  StorageDepositArgs,
  StorageUnregisterArgs,
  StorageWithdrawArgs,
  Transaction,
  SpecificFunctionCallOptions,
  FunctionCallOptions, NearApiJsTransactionLike, NearWalletSelectorTransactionLike
} from "../types";
import {ActionFactory} from "./ActionFactory";
import {BaseArgs} from "../types";
import {AccessKey, Action} from "../types";
import {
  parseNearApiJsTransaction,
  parseNearWalletSelectorTransaction
} from "../utils";
import {Amount} from "../utils";
import {Gas} from "../utils";

/**
 * Helper class for creating transaction(s)
 * Builder Pattern
 */
export class MultiTransaction {
  transactions: Transaction[]

  constructor(receiverId: string, signerId?: string) {
    this.transactions = []
    this.nextTransaction(receiverId, signerId)
  }

  private currentIndex(): number {
    return this.transactions.length - 1
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0
  }

  isEmpty(): boolean {
    return !this.transactions.some(transaction => {
      return transaction.actions.length !== 0
    })
  }

  nextTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return this.addTransaction({
      signerId,
      receiverId,
      actions: []
    })
  }

  addTransaction(...transaction: Transaction[]): MultiTransaction {
    this.transactions.push(...transaction)
    return this
  }

  addAction(...action: Action[]): MultiTransaction {
    this.transactions[this.currentIndex()].actions.push(...action)
    return this
  }

  static fromTransactions(...transactions: Transaction[]): MultiTransaction {
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

  toTransactions(): Transaction[] {
    return [...this.transactions]
  }

  extend(other: MultiTransaction): MultiTransaction {
    return this.addTransaction(...other.toTransactions())
  }

  // --------------------------------------Transform-------------------------------------------

  parseNearApiJsTransactions(): NearApiJsTransactionLike[] {
    return this.toTransactions().map(transaction => {
      return parseNearApiJsTransaction(transaction)
    })
  }

  parseNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    return this.toTransactions().map(transaction => {
      return parseNearWalletSelectorTransaction(transaction)
    })
  }

  // --------------------------------------Action-------------------------------------------

  createAccount(): MultiTransaction {
    return this.addAction(ActionFactory.createAccount())
  }

  deleteAccount(beneficiaryId: string): MultiTransaction {
    return this.addAction(ActionFactory.deleteAccount({beneficiaryId}))
  }

  addKey(
    publicKey: string,
    accessKey: AccessKey
  ): MultiTransaction {
    return this.addAction(ActionFactory.addKey({publicKey, accessKey}))
  }

  deleteKey(publicKey: string): MultiTransaction {
    return  this.addAction(ActionFactory.deleteKey({publicKey}))
  }

  deployContract(code: Uint8Array): MultiTransaction {
    return this.addAction(ActionFactory.deployContract({code}))
  }

  stake(amount: string, publicKey: string): MultiTransaction {
    return this.addAction(ActionFactory.stake({amount, publicKey}))
  }

  functionCall<Args extends BaseArgs>({
    methodName,
    args,
    attachedDeposit,
    gas
  }: SpecificFunctionCallOptions<Args>): MultiTransaction {
    return this.addAction(ActionFactory.functionCall({
      methodName,
      args,
      attachedDeposit: attachedDeposit ?? Amount.ZERO,
      gas: gas ?? Gas.DEFAULT
    }))
  }

  transfer(amount: string): MultiTransaction {
    return this.addAction(ActionFactory.transfer({amount}))
  }

  // --------------------------------------NEP145-------------------------------------------

  storage_deposit({args, attachedDeposit, gas}: FunctionCallOptions<StorageDepositArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas
    })
  }

  storage_withdraw({args, gas}: FunctionCallOptions<StorageWithdrawArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  storage_unregister({args, gas}: FunctionCallOptions<StorageUnregisterArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  // --------------------------------------NEP141-------------------------------------------

  ft_transfer({args, gas}: FunctionCallOptions<FtTransferArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  ft_transfer_call({args, gas}: FunctionCallOptions<FtTransferCallArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50)
    })
  }

  // --------------------------------------NEP171-------------------------------------------

  nft_transfer({args, gas}: FunctionCallOptions<NftTransferArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  nft_transfer_call({args, gas}: FunctionCallOptions<NftTransferCallArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50)
    })
  }

  nft_approve({args, attachedDeposit, gas}: FunctionCallOptions<NftApproveArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'nft_approve',
      args,
      attachedDeposit,
      gas
    })
  }

  nft_revoke({args, gas}: FunctionCallOptions<NftRevokeArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  nft_revoke_all({args, gas}: FunctionCallOptions<NftRevokeAllArgs>): MultiTransaction {
    return this.functionCall({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }
}
