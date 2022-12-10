import { FtTransferArgs, FtTransferCallArgs } from './args';

export interface FtTransferOptions {
  args: FtTransferArgs;
  gas?: string;
}

export interface FtTransferCallOptions {
  args: FtTransferCallArgs;
  gas?: string;
}
