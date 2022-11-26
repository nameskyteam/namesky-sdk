import {BlockReference} from "near-api-js/lib/providers/provider";

export interface SpecificFunctionCallOptions<Args extends BaseArgs> extends FunctionCallOptions<Args> {
  methodName: string
}

export interface FunctionCallOptions<Args extends BaseArgs> {
  args: Args
  attachedDeposit?: string
  gas?: string
}

export interface SpecificFunctionViewOptions<Args extends BaseArgs> extends FunctionViewOptions<Args> {
  contractId: string
  methodName: string
}

export interface FunctionViewOptions<Args extends BaseArgs> {
  args: Args,
  blockQuery?: BlockReference
}

export type BaseArgs = object
