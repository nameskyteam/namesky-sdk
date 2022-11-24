export interface FunctionCallOptions<Args extends BaseArgs> extends SpecificFunctionCallOptions<Args> {
  methodName: string
}

export interface SpecificFunctionCallOptions<Args extends BaseArgs> {
  args: Args
  attachedDeposit?: string
  gas?: string
}

export interface FunctionViewOptions<Args extends BaseArgs> extends SpecificFunctionViewOptions<Args> {
  methodName: string
}

export interface SpecificFunctionViewOptions<Args extends BaseArgs> {
  args: Args
}

export type BaseArgs = object
