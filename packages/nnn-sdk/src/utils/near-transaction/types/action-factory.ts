import {AccessKeyPermission} from "./action";

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

export interface FunctionCallOptions {
  methodName: string
  args: object
  attachedDeposit: string
  gas: string
}

export interface TransferOptions {
  amount: string
}
