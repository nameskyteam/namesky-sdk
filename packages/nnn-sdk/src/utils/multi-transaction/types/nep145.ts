import {SpecificFunctionCallOptions} from "./common";

export type StoragedepositOptions = SpecificFunctionCallOptions<StorageDepositArgs>

export interface StorageDepositArgs {
  account_id?: string
  registration_only?: boolean
}

export type StorageWithdrawOptions = Omit<SpecificFunctionCallOptions<StorageWithdrawArgs>, "attachedDeposit">

export interface StorageWithdrawArgs {
  amount?: string
}

export type StorageUnregisterOptions = Omit<SpecificFunctionCallOptions<StorageUnregisterArgs>, "attachedDeposit">

export interface StorageUnregisterArgs {
  force?: boolean
}
