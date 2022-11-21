import {BlockReference} from "near-api-js/lib/providers/provider";

export interface ContractCallOptions {
  attachedDeposit?: string
  gas?: string,
  callbackUrl?: string
}

export interface ContractViewOptions {
  blockQuery?: BlockReference
}
