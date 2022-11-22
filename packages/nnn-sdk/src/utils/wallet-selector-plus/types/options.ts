import {AccessKeyPermission} from "./action";
import {BlockReference} from "near-api-js/lib/providers/provider";
import {Merge} from "./common";

export interface DeleteAccountOptions {
  beneficiaryId: string
}

export interface AddKeyOptions {
  publicKey: string
  permission: AccessKeyPermission
  nonce?: number
}

export interface DeleteKeyOptions {
  publicKey: string
}

export interface DeployContractOptions {
  code: Uint8Array
}

export interface StakeOptions {
  amount: string
  publicKey: string
}

export interface FunctionCallOptions<Args extends BaseArgs> {
  methodName: string
  args?: Args
  attachedDeposit?: string
  gas?: string
}

export interface TransferOptions {
  amount: string
}

export type BaseArgs = object

export type ViewOptions<Args extends BaseArgs> = Merge<Pick<FunctionCallOptions<Args>, 'methodName' | 'args'>, {
  contractId: string
  blockQuery?: BlockReference
}>

export type ReceiverIdOrOptions = string | { signerId?: string, receiverId: string }
