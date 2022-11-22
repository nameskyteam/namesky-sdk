export interface CreateAccountActionLike {
  type: "CreateAccount"
  params: Record<string, never>
}

export interface DeleteAccountActionLike {
  type: "DeleteAccount"
  params: {
    beneficiaryId: string
  }
}

export interface AddKeyActionLike {
  type: "AddKey"
  params: {
    publicKey: string
    accessKey: {
      permission: AccessKeyPermission
    }
    nonce?: number
  }
}

export interface DeleteKeyActionLike {
  type: "DeleteKey"
  params: {
    publicKey: string
  }
}

export interface StakeActionLike {
  type: "Stake"
  params: {
    amount: string
    publicKey: string
  }
}

export interface DeployContractActionLike {
  type: "DeployContract"
  params: {
    code: Uint8Array
  }
}

export interface FunctionCallActionLike {
  type: "FunctionCall"
  params: {
    methodName: string
    args: object
    attachedDeposit: string
    gas: string
  }
}

export interface TransferActionLike {
  type: "Transfer"
  params: {
    amount: string
  }
}

export type ActionLike = 
  | CreateAccountActionLike
  | DeleteAccountActionLike
  | AddKeyActionLike
  | DeleteKeyActionLike
  | DeployContractActionLike
  | StakeActionLike
  | FunctionCallActionLike
  | TransferActionLike

export type AccessKeyPermission = FullAccess | FunctionCallAccess

export type FullAccess = 'FullAccess'

export interface FunctionCallAccess {
  receiverId: string
  methodNames: string[]
  allowance?: string
}

export type ActionType = ActionLike['type']
