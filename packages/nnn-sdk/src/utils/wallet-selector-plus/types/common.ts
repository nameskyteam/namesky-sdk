import {BaseArgs} from "../../near-transaction/types/common";
import {BlockReference} from "near-api-js/lib/providers/provider";

export interface ViewOptions<Args extends BaseArgs> {
  contractId: string
  methodName: string,
  args: Args
  blockQuery?: BlockReference
}
