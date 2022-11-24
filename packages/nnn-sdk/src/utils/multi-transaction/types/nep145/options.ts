import {SpecificFunctionCallOptions} from "../common";
import {StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs} from "./args";

export type StorageDepositOptions = Omit<SpecificFunctionCallOptions<StorageDepositArgs>, ''>

export type StorageWithdrawOptions = Omit<SpecificFunctionCallOptions<StorageWithdrawArgs>, "attachedDeposit">

export type StorageUnregisterOptions = Omit<SpecificFunctionCallOptions<StorageUnregisterArgs>, "attachedDeposit">
