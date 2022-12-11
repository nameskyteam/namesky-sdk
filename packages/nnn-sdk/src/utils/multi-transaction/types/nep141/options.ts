import { FtTransferArgs, FtTransferCallArgs } from './args';

export interface FtTransferOptions {
  args: FtTransferArgs;
  attachedDeposit?: string;
  gas?: string;
}

export interface FtTransferCallOptions {
  args: FtTransferCallArgs;
  attachedDeposit?: string;
  gas?: string;
}
