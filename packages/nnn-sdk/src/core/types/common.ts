import {BlockReference} from "near-api-js/lib/providers/provider";
import {BaseArgs, SpecificFunctionCallOptions, SpecificFunctionViewOptions} from "../../utils";

export interface CallOptions<Args extends BaseArgs> extends SpecificFunctionCallOptions<Args> {
  callbackUrl?: string
}

export interface ViewOptions <Args extends BaseArgs> extends SpecificFunctionViewOptions<Args> {
  blockQuery?: BlockReference
}
