export interface FunctionCallOptions<Args extends BaseArgs> {
  methodName: string
  args: Args
  attachedDeposit?: string
  gas?: string
}

export type BaseArgs = object
