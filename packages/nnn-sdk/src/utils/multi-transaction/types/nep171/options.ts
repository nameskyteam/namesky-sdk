import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';

export interface NftTransferOptions {
  args: NftTransferArgs;
  gas?: string;
}

export interface NftTransferCallOptions {
  args: NftTransferCallArgs;
  gas?: string;
}

export interface NftApproveOptions {
  args: NftApproveArgs;
  attachedDeposit: string;
  gas?: string;
}

export interface NftRevokeOptions {
  args: NftRevokeArgs;
  gas?: string;
}

export interface NftRevokeAllOptions {
  args: NftRevokeAllArgs;
  gas?: string;
}
