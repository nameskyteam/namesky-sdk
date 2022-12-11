import { FtTransferArgs, FtTransferCallArgs } from './args';
import { AttachedDepositOptions, GasOptions, ArgsOptions } from '../options';

export interface FtTransferOptions extends Required<ArgsOptions<FtTransferArgs>>, AttachedDepositOptions, GasOptions {}

export interface FtTransferCallOptions
  extends Required<ArgsOptions<FtTransferCallArgs>>,
    AttachedDepositOptions,
    GasOptions {}
