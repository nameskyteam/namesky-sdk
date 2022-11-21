import {AddKeyPermission} from "@near-wallet-selector/core/lib/wallet/transactions.types";
import {BaseArgs} from "./common";

export interface FunctionCall<Args extends BaseArgs> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
}

export interface DeployContract {
  code: Uint8Array;
}

export interface Transfer {
  amount: string;
}

export interface Stake {
  amount: string;
  publicKey: string;
}

export interface AddKey {
  publicKey: string;
  permission: AddKeyPermission;
  nonce?: number;
}

export interface DeleteKey {
  publicKey: string;
}

export interface DeleteAccount {
  beneficiaryId: string;
}

export interface DeleteKey {
  publicKey: string;
}
