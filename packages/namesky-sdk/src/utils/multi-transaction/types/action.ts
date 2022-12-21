export type Action =
  | CreateAccountAction
  | DeleteAccountAction
  | AddKeyAction
  | DeleteKeyAction
  | DeployContractAction
  | StakeAction
  | FunctionCallAction
  | TransferAction;

export interface CreateAccountAction {
  type: 'CreateAccount';
  params: CreateAccountParams;
}

export interface DeleteAccountAction {
  type: 'DeleteAccount';
  params: DeleteAccountParams;
}

export interface AddKeyAction {
  type: 'AddKey';
  params: AddKeyParams;
}

export interface DeleteKeyAction {
  type: 'DeleteKey';
  params: DeleteKeyParams;
}

export interface DeployContractAction {
  type: 'DeployContract';
  params: DeployContractParams;
}

export interface StakeAction {
  type: 'Stake';
  params: StakeParams;
}

export interface FunctionCallAction {
  type: 'FunctionCall';
  params: FunctionCallParams;
}

export interface TransferAction {
  type: 'Transfer';
  params: TransferParams;
}

export interface CreateAccountParams {}

export interface DeleteAccountParams {
  beneficiaryId: string;
}

export interface AddKeyParams {
  publicKey: string;
  accessKey: AccessKey;
}

export interface DeleteKeyParams {
  publicKey: string;
}

export interface DeployContractParams {
  code: Uint8Array;
}

export interface StakeParams {
  amount: string;
  publicKey: string;
}

export interface FunctionCallParams {
  methodName: string;
  args: MethodArgs;
  attachedDeposit: string;
  gas: string;
}

export type MethodArgs = object | Uint8Array;

export interface TransferParams {
  amount: string;
}

export interface AccessKey {
  permission: AccessKeyPermission;
  nonce?: number;
}

export type AccessKeyPermission = 'FullAccess' | FunctionCallAccess;

export interface FunctionCallAccess {
  receiverId: string;
  methodNames: string[];
  allowance?: string;
}
