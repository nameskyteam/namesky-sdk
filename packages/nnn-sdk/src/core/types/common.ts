import {BlockReference} from "near-api-js/lib/providers/provider";
import {BaseArgs} from "../../utils";

export interface ContractCallOptions<Args extends BaseArgs> {
  args?: Args
  attachedDeposit?: string
  gas?: string,
  callbackUrl?: string
}

export interface ContractViewOptions <Args extends BaseArgs> {
  args?: Args
  blockQuery?: BlockReference
}
