import {SpecificFunctionCallOptions} from "./common";

export type StorageDepositOptions = Omit<SpecificFunctionCallOptions<StorageDepositArgs>, ''>

export type StorageWithdrawOptions = Omit<SpecificFunctionCallOptions<StorageWithdrawArgs>, "attachedDeposit">

export type StorageUnregisterOptions = Omit<SpecificFunctionCallOptions<StorageUnregisterArgs>, "attachedDeposit">

export interface StorageDepositArgs {
  account_id?: string
  registration_only?: boolean
}

export interface StorageWithdrawArgs {
  amount?: string
}

export interface StorageUnregisterArgs {
  force?: boolean
}

export interface StorageBalanceOfArgs {
  account_id: string
}

export interface StorageBalance {
  total: string
  available: string
}

export interface StorageBalanceBoundsArgs {}

export interface StorageBalanceBounds {
  min: string,
  max?: string
}
