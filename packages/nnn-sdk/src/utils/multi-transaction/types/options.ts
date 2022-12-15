import { BlockReference } from 'near-api-js/lib/providers/provider';

export interface EmptyArgs {}

export interface FunctionCallOptions<Args extends EmptyArgs> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
}

export type FunctionViewOptions<Args extends EmptyArgs> = Pick<FunctionCallOptions<Args>, 'methodName' | 'args'> & {
  contractId: string;
  blockQuery?: BlockQuery;
};

export type BlockQuery = BlockReference;

export type ArgsOptions<Args extends EmptyArgs> = Pick<FunctionCallOptions<Args>, 'args'>;

export type AttachedDepositOptions = Pick<FunctionCallOptions<any>, 'attachedDeposit'>;

export type GasOptions = Pick<FunctionCallOptions<any>, 'gas'>;
