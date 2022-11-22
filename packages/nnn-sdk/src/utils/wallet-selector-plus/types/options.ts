import {FunctionCall} from "./action";
import {BlockReference} from "near-api-js/lib/providers/provider";
import {BaseArgs, Merge} from "./common";

export type ViewOptions<Args extends BaseArgs> = Merge<Pick<FunctionCall<Args>, 'methodName' | 'args'>, {
  contractId: string
  blockQuery?: BlockReference
}>

export type ReceiverIdOrOptions = string | { signerId?: string, receiverId: string }
