import {BlockReference} from "near-api-js/lib/providers/provider";
import {BaseArgs, FunctionCallOptions} from "../../near-transaction/types/options";
import {Merge} from "./common";

export type ViewOptions<Args extends BaseArgs> = Merge<Pick<FunctionCallOptions<Args>, 'methodName' | 'args'>, {
  contractId: string
  blockQuery?: BlockReference
}>
