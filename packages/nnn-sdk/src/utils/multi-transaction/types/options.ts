import { BlockReference } from 'near-api-js/lib/providers/provider';

export interface FunctionCallOptions<Args extends EmptyArgs> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
}

export interface FunctionViewOptions<Args extends EmptyArgs> {
  contractId: string;
  methodName: string;
  args?: Args;
  blockQuery?: BlockReference;
}

export interface EmptyArgs {}
