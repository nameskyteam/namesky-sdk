export interface StorageDepositArgs {
  account_id?: string;
  registration_only?: boolean;
}

export interface StorageWithdrawArgs {
  amount?: string;
}

export interface StorageUnregisterArgs {
  force?: boolean;
}

export interface StorageBalanceOfArgs {
  account_id: string;
}

export interface StorageBalanceBoundsArgs {}
