import { FtTransferArgs, FtTransferCallArgs } from './args';
import { AttachedDepositOptions, GasOptions, RequiredArgsOptions } from '../options';

export interface FtTransferOptions extends RequiredArgsOptions<FtTransferArgs>, AttachedDepositOptions, GasOptions {}

export interface FtTransferCallOptions
  extends RequiredArgsOptions<FtTransferCallArgs>,
    AttachedDepositOptions,
    GasOptions {}
