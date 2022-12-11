import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';
import { AttachedDepositOptions, GasOptions, ArgsOptions } from '../options';

export interface NftTransferOptions
  extends Required<ArgsOptions<NftTransferArgs>>,
    AttachedDepositOptions,
    GasOptions {}

export interface NftTransferCallOptions
  extends Required<ArgsOptions<NftTransferCallArgs>>,
    AttachedDepositOptions,
    GasOptions {}

export interface NftApproveOptions extends Required<ArgsOptions<NftApproveArgs>>, AttachedDepositOptions, GasOptions {}

export interface NftRevokeOptions extends Required<ArgsOptions<NftRevokeArgs>>, AttachedDepositOptions, GasOptions {}

export interface NftRevokeAllOptions
  extends Required<ArgsOptions<NftRevokeAllArgs>>,
    AttachedDepositOptions,
    GasOptions {}
