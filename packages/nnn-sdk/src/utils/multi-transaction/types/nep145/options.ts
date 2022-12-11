import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';
import { ArgsOptions, AttachedDepositOptions, GasOptions } from '../options';

export interface StorageDepositOptions extends ArgsOptions<StorageDepositArgs>, AttachedDepositOptions, GasOptions {}

export interface StorageWithdrawOptions extends ArgsOptions<StorageWithdrawArgs>, AttachedDepositOptions, GasOptions {}

export interface StorageUnregisterOptions
  extends ArgsOptions<StorageUnregisterArgs>,
    AttachedDepositOptions,
    GasOptions {}
