import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';

export interface NftTransferOptions {
  args: NftTransferArgs;
  attachedDeposit?: string;
  gas?: string;
}

export interface NftTransferCallOptions {
  args: NftTransferCallArgs;
  attachedDeposit?: string;
  gas?: string;
}

export interface NftApproveOptions {
  args: NftApproveArgs;
  attachedDeposit?: string;
  gas?: string;
}

export interface NftRevokeOptions {
  args: NftRevokeArgs;
  attachedDeposit?: string;
  gas?: string;
}

export interface NftRevokeAllOptions {
  args: NftRevokeAllArgs;
  attachedDeposit?: string;
  gas?: string;
}
