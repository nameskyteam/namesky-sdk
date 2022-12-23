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
  MethodArgs, Optional,
} from '../types';
import { ActionFactory } from './ActionFactory';
import { AccessKey, Action } from '../types';
import { parseNearApiJsTransaction, parseNearWalletSelectorTransaction } from '../utils';
import { Amount } from '../utils';
import { Gas } from '../utils';

/**
 * @description Helper class for creating transaction(s) with builder pattern
 *
 * @example
 * // Create an account for alice's honey and send some wNEAR
 * // to this account for a birthday gift
 * MultiTransaction
 *   // first transaction for creating account
 *   .createTransaction('honey.alice.near', 'alice.near')
 *   .createAccount()
 *   .transfer(Amount.parseYoctoNear('0.1'))
 *   .addKey('ed25519:this is a public key', { permission: 'FullAccess' })
 *   // second transaction for sending wNEAR
 *   .createTransaction('wrap.near')
 *   .storage_deposit({
 *     args: {
 *       account_id: 'honey.alice.near'
 *     },
 *     attachedDeposit: Amount.parseYoctoNear('0.00125')
 *   })
 *   .ft_transfer({
 *     args: {
 *       receiver_id: 'honey.alice.near',
 *       amount: Amount.parseYoctoNear('100'),
 *       memo: 'Happy Birthday'
 *     }
 *   })
 */
export class MultiTransaction {
  transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  // Return an empty 'MultiTransaction' object
  // Usually followed by the method '.createTransaction(/* args */)'
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  // Return a 'MultiTransaction' object and create a new transaction without action in this object
  static createTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return MultiTransaction.new().createTransaction(receiverId, signerId);
  }

  private currentIndex(): number {
    return this.transactions.length - 1;
  }

  isMultiple(): boolean {
    return this.currentIndex() > 0;
  }

  isEmpty(): boolean {
    return this.currentIndex() === -1;
  }

  // Create a new transaction without action in original object
  createTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return this.addTransactions({ signerId, receiverId, actions: [] });
  }

  addTransactions(...transactions: Transaction[]): MultiTransaction {
    this.transactions.push(...transactions);
    return this;
  }

  addActions(...actions: Action[]): MultiTransaction {
    if (this.isEmpty()) {
      throw Error(`Error empty transaction, consider calling method '.createTransaction(/* args */)' first`);
    }
    this.transactions[this.currentIndex()].actions.push(...actions);
    return this;
  }

  static fromTransactions(...transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(...transactions);
  }

  toTransactions(): Transaction[] {
    return [...this.transactions];
  }

  extend(other: MultiTransaction): MultiTransaction {
    return this.addTransactions(...other.toTransactions());
  }

  // ------------------------------------------- Transform -------------------------------------------------
  toNearApiJsTransactions(): NearApiJsTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearApiJsTransaction(transaction);
    });
  }

  toNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearWalletSelectorTransaction(transaction);
    });
  }

  // -------------------------------------------- Action ---------------------------------------------------
  createAccount(): MultiTransaction {
    return this.addActions(ActionFactory.createAccount());
  }

  deleteAccount(beneficiaryId: string): MultiTransaction {
    return this.addActions(ActionFactory.deleteAccount({ beneficiaryId }));
  }

  addKey(publicKey: string, accessKey: Optional<AccessKey, 'nonce'>): MultiTransaction {
    const {permission, nonce} = accessKey
    return this.addActions(ActionFactory.addKey({ publicKey, accessKey: { permission, nonce: nonce ?? 0 } }));
  }

  deleteKey(publicKey: string): MultiTransaction {
    return this.addActions(ActionFactory.deleteKey({ publicKey }));
  }

  deployContract(code: Uint8Array): MultiTransaction {
    return this.addActions(ActionFactory.deployContract({ code }));
  }

  stake(amount: string, publicKey: string): MultiTransaction {
    return this.addActions(ActionFactory.stake({ amount, publicKey }));
  }

  functionCall<Args extends MethodArgs>({
    methodName,
    args,
    attachedDeposit,
    gas,
  }: FunctionCallOptions<Args>): MultiTransaction {
    return this.addActions(
      ActionFactory.functionCall({
        methodName,
        args: args ?? {},
        attachedDeposit: attachedDeposit ?? Amount.ZERO,
        gas: gas ?? Gas.DEFAULT,
      })
    );
  }

  transfer(amount: string): MultiTransaction {
    return this.addActions(ActionFactory.transfer({ amount }));
  }

  // --------------------------------------------- NEP145 --------------------------------------------------
  storage_deposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  storage_withdraw({ args, gas, attachedDeposit }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  storage_unregister({ args, gas, attachedDeposit }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  // --------------------------------------------- NEP141 --------------------------------------------------
  ft_transfer({ args, gas, attachedDeposit }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  ft_transfer_call({ args, gas, attachedDeposit }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  // --------------------------------------------- NEP171 --------------------------------------------------
  nft_transfer({ args, gas, attachedDeposit }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_transfer_call({ args, gas, attachedDeposit }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke({ args, gas, attachedDeposit }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke_all({ args, gas, attachedDeposit }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
      gas,
    });
  }
}
