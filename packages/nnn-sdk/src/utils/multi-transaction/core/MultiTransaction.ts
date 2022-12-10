import {
  FtTransferArgs,
  FtTransferCallArgs,
  NftApproveArgs,
  NftRevokeAllArgs,
  NftRevokeArgs,
  NftTransferArgs,
  NftTransferCallArgs,
  Transaction,
  FunctionCallOptions,
  NearApiJsTransactionLike,
  NearWalletSelectorTransactionLike,
  StorageDepositOptions,
  StorageWithdrawOptions,
  StorageUnregisterOptions,
  FtTransferOptions,
  FtTransferCallOptions,
  StorageDepositArgs,
  StorageWithdrawArgs,
  StorageUnregisterArgs,
  NftTransferOptions,
  NftTransferCallOptions,
  NftApproveOptions,
  NftRevokeOptions,
  NftRevokeAllOptions,
} from '../types';
import { ActionFactory } from './ActionFactory';
import { BaseArgs } from '../types';
import { AccessKey, Action } from '../types';
import { parseNearApiJsTransaction, parseNearWalletSelectorTransaction } from '../utils';
import { Amount } from '../utils';
import { Gas } from '../utils';

/**
 * Helper class for creating transaction(s)
 * Builder Pattern
 */
export class MultiTransaction {
  transactions: Transaction[];

  constructor(receiverId: string, signerId?: string) {
    this.transactions = [];
    this.nextTransaction(receiverId, signerId);
  }

  private currentIndex(): number {
    return this.transactions.length - 1;
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0;
  }

  isEmpty(): boolean {
    return !this.transactions.some((transaction) => {
      return transaction.actions.length !== 0;
    });
  }

  nextTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return this.addTransaction({
      signerId,
      receiverId,
      actions: [],
    });
  }

  addTransaction(...transaction: Transaction[]): MultiTransaction {
    this.transactions.push(...transaction);
    return this;
  }

  addAction(...action: Action[]): MultiTransaction {
    this.transactions[this.currentIndex()].actions.push(...action);
    return this;
  }

  static fromTransactions(...transactions: Transaction[]): MultiTransaction {
    if (transactions.length === 0) {
      throw Error('Bad transaction(s)');
    }
    let multiTransaction: MultiTransaction;
    transactions.forEach((transaction, index) => {
      if (index === 0) {
        const { signerId, receiverId, actions } = transaction;
        multiTransaction = new MultiTransaction(receiverId, signerId).addAction(...actions);
      } else {
        multiTransaction.addTransaction(transaction);
      }
    });
    return multiTransaction!;
  }

  toTransactions(): Transaction[] {
    return [...this.transactions];
  }

  extend(other: MultiTransaction): MultiTransaction {
    return this.addTransaction(...other.toTransactions());
  }

  // --------------------------------------Transform-------------------------------------------

  parseNearApiJsTransactions(): NearApiJsTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearApiJsTransaction(transaction);
    });
  }

  parseNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearWalletSelectorTransaction(transaction);
    });
  }

  // --------------------------------------Action-------------------------------------------

  createAccount(): MultiTransaction {
    return this.addAction(ActionFactory.createAccount());
  }

  deleteAccount(beneficiaryId: string): MultiTransaction {
    return this.addAction(ActionFactory.deleteAccount({ beneficiaryId }));
  }

  addKey(publicKey: string, accessKey: AccessKey): MultiTransaction {
    return this.addAction(ActionFactory.addKey({ publicKey, accessKey }));
  }

  deleteKey(publicKey: string): MultiTransaction {
    return this.addAction(ActionFactory.deleteKey({ publicKey }));
  }

  deployContract(code: Uint8Array): MultiTransaction {
    return this.addAction(ActionFactory.deployContract({ code }));
  }

  stake(amount: string, publicKey: string): MultiTransaction {
    return this.addAction(ActionFactory.stake({ amount, publicKey }));
  }

  functionCall<Args extends BaseArgs>({
    methodName,
    args,
    attachedDeposit,
    gas,
  }: FunctionCallOptions<Args>): MultiTransaction {
    return this.addAction(
      ActionFactory.functionCall({
        methodName,
        args,
        attachedDeposit: attachedDeposit ?? Amount.ZERO,
        gas: gas ?? Gas.DEFAULT,
      })
    );
  }

  transfer(amount: string): MultiTransaction {
    return this.addAction(ActionFactory.transfer({ amount }));
  }

  // --------------------------------------------- NEP145 --------------------------------------------------
  storage_deposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args: args ?? {},
      attachedDeposit,
      gas,
    });
  }

  storage_withdraw({ args, gas }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args: args ?? {},
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  storage_unregister({ args, gas }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args: args ?? {},
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  // --------------------------------------------- NEP141 --------------------------------------------------
  ft_transfer({ args, gas }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  ft_transfer_call({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  // --------------------------------------------- NEP171 --------------------------------------------------
  nft_transfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_transfer_call({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit,
      gas,
    });
  }

  nft_revoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke_all({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
