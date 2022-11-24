import {TransactionLike} from "../types";
import {ActionFactory} from "./ActionFactory";
import {BaseArgs, FunctionCallOptions} from "../types";
import {AccessKey, ActionLike} from "../types";
import {NearApiJsTransactionLike, NearWalletSelectorTransactionLike} from "../types";
import {
  parseNearApiJsTransaction,
  parseNearWalletSelectorTransaction
} from "../utils";
import {Amount} from "../utils";
import {Gas} from "../utils";
import {
  StorageDepositOptions,
  StorageUnregisterOptions,
  StorageWithdrawOptions
} from "../types/nep145";
import {FtTransferCallOptions, FtTransferOptions} from "../types/nep141";
import {
  NftApproveOptions,
  NftRevokeAllOptions,
  NftRevokeOptions,
  NftTransferCallOptions,
  NftTransferOptions
} from "../types/nep171";

/**
 * Helper class for creating transaction(s)
 */
export class MultiTransaction {
  transactions: TransactionLike[]

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

  nextTransaction(receiverId: string, signerId?: string) {
    return this.addTransaction({
      signerId,
      receiverId,
      actions: []
    })
  }

  addTransaction(...transaction: TransactionLike[]) {
    this.transactions.push(...transaction)
    return this
  }

  addAction(...action: ActionLike[]): this {
    this.transactions[this.currentIndex()].actions.push(...action)
    return this
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

  createAccount() {
    return this.addAction(ActionFactory.createAccount())
  }

  deleteAccount(beneficiaryId: string) {
    return this.addAction(ActionFactory.deleteAccount({beneficiaryId}))
  }

  addKey(
    publicKey: string,
    accessKey: AccessKey
  ) {
    return this.addAction(ActionFactory.addKey({publicKey, accessKey}))
  }

  deleteKey(publicKey: string) {
    return  this.addAction(ActionFactory.deleteKey({publicKey}))
  }

  deployContract(code: Uint8Array) {
    return this.addAction(ActionFactory.deployContract({code}))
  }

  stake(amount: string, publicKey: string) {
    return this.addAction(ActionFactory.stake({amount, publicKey}))
  }

  functionCall<Args extends BaseArgs>({
    methodName,
    args,
    attachedDeposit,
    gas
  }: FunctionCallOptions<Args>) {
    return this.addAction(ActionFactory.functionCall({
      methodName,
      args,
      attachedDeposit: attachedDeposit ?? Amount.ZERO,
      gas: gas ?? Gas.DEFAULT
    }))
  }

  transfer(amount: string) {
    return this.addAction(ActionFactory.transfer({amount}))
  }

  // --------------------------------------NEP145-------------------------------------------

  storage_deposit({args, attachedDeposit, gas}: StorageDepositOptions) {
    return this.functionCall({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas
    })
  }

  storage_withdraw({args, gas}: StorageWithdrawOptions) {
    return this.functionCall({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  storage_unregister({args, gas}: StorageUnregisterOptions) {
    return this.functionCall({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  // --------------------------------------NEP141-------------------------------------------

  ft_transfer({args, gas}: FtTransferOptions) {
    return this.functionCall({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  ft_transfer_call({args, gas}: FtTransferCallOptions) {
    return this.functionCall({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  // --------------------------------------NEP171-------------------------------------------

  nft_transfer({args, gas}: NftTransferOptions) {
    return this.functionCall({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  nft_transfer_call({args, gas}: NftTransferCallOptions) {
    return this.functionCall({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  nft_approve({args, attachedDeposit, gas}: NftApproveOptions) {
    return this.functionCall({
      methodName: 'nft_approve',
      args,
      attachedDeposit,
      gas
    })
  }

  nft_revoke({args, gas}: NftRevokeOptions) {
    return this.functionCall({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }

  nft_revoke_all({args, gas}: NftRevokeAllOptions) {
    return this.functionCall({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas
    })
  }
}
