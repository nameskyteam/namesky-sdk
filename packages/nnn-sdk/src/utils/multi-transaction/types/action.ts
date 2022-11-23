export type ActionLike =
  | CreateAccountActionLike
  | DeleteAccountActionLike
  | AddKeyActionLike
  | DeleteKeyActionLike
  | DeployContractActionLike
  | StakeActionLike
  | FunctionCallActionLike
  | TransferActionLike

export interface CreateAccountActionLike {
  type: "CreateAccount"
  params: CreateAccountParams
}

export interface DeleteAccountActionLike {
  type: "DeleteAccount"
  params: DeleteAccountParams
}

export interface AddKeyActionLike {
  type: "AddKey"
  params: AddKeyParams
}

export interface DeleteKeyActionLike {
  type: "DeleteKey"
  params: DeleteKeyParams
}

export interface DeployContractActionLike {
  type: "DeployContract"
  params: DeployContractParams
}

export interface StakeActionLike {
  type: "Stake"
  params: StakeParams
}

export interface FunctionCallActionLike {
  type: "FunctionCall"
  params: FunctionCallParams
}

export interface TransferActionLike {
  type: "Transfer"
  params: TransferParams
}

export interface CreateAccountParams {}

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

export interface AccessKey {
  permission: AccessKeyPermission,
  nonce?: number
}

export type AccessKeyPermission = 'FullAccess' | FunctionCallAccess

export interface FunctionCallAccess {
  receiverId: string
  methodNames: string[]
  allowance?: string
}
