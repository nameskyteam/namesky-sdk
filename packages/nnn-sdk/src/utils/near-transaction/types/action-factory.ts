import {AccessKey} from "./action";

export interface DeleteAccountParams {
  beneficiaryId: string
}

export interface AddKeyParams {
  publicKey: string
  accessKey: AccessKey
}

export interface DeleteKeyParams {
  publicKey: string
}

export interface DeployContractParams {
  code: Uint8Array
}

export interface StakeParams {
  amount: string
  publicKey: string
}

export interface FunctionCallParams {
  methodName: string
  args: object
  attachedDeposit: string
  gas: string
}

export interface TransferParams {
  amount: string
}
