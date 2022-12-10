import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';

export interface StorageDepositOptions {
  args?: StorageDepositArgs;
  attachedDeposit: string;
  gas?: string;
}

export interface StorageWithdrawOptions {
  args?: StorageWithdrawArgs;
  gas?: string;
}

export interface StorageUnregisterOptions {
  args?: StorageUnregisterArgs;
  gas?: string;
}
