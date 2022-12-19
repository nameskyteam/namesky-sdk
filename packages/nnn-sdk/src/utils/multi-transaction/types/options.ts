import { BlockReference } from 'near-api-js/lib/providers/provider';

export interface FunctionCallOptions<Args extends object> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
}

export type FunctionViewOptions<Value, Args extends object | Uint8Array> = Pick<
  FunctionCallOptions<Args>,
  'methodName' | 'args'
> & {
  contractId: string;
  blockQuery?: BlockQuery;
  parse?: ResponseParser<Value>;
};

export type ResponseParser<Value> = (response: Uint8Array) => Value;

export type BlockQuery = BlockReference;

export type ArgsOptions<Args extends object> = Pick<FunctionCallOptions<Args>, 'args'>;

export type AttachedDepositOptions = Pick<FunctionCallOptions<any>, 'attachedDeposit'>;

export type GasOptions = Pick<FunctionCallOptions<any>, 'gas'>;
