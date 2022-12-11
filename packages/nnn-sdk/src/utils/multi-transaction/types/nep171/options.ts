import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';
import { AttachedDepositOptions, GasOptions, RequiredArgsOptions } from '../options';

export interface NftTransferOptions extends RequiredArgsOptions<NftTransferArgs>, AttachedDepositOptions, GasOptions {}

export interface NftTransferCallOptions
  extends RequiredArgsOptions<NftTransferCallArgs>,
    AttachedDepositOptions,
    GasOptions {}

export interface NftApproveOptions extends RequiredArgsOptions<NftApproveArgs>, AttachedDepositOptions, GasOptions {}

export interface NftRevokeOptions extends RequiredArgsOptions<NftRevokeArgs>, AttachedDepositOptions, GasOptions {}

export interface NftRevokeAllOptions
  extends RequiredArgsOptions<NftRevokeAllArgs>,
    AttachedDepositOptions,
    GasOptions {}
