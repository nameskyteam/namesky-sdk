import { BlockReference } from 'near-api-js/lib/providers/provider';

export interface FunctionCallOptions<Args extends BaseArgs> {
  methodName: string;
  args: Args;
  attachedDeposit?: string;
  gas?: string;
}

export interface FunctionViewOptions<Args extends BaseArgs> {
  contractId: string;
  methodName: string;
  args: Args;
  blockQuery?: BlockReference;
}

export type BaseArgs = object;
