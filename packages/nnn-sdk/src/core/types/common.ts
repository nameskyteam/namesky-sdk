import {BlockReference} from "near-api-js/lib/providers/provider";
import {BaseArgs, SpecificFunctionCallOptions, SpecificFunctionViewOptions} from "../../utils";

export interface CallOptions<Args extends BaseArgs> extends SpecificFunctionCallOptions<Args> {
  callbackUrl?: string
}

export interface ViewOptions <Args extends BaseArgs> extends SpecificFunctionViewOptions<Args> {
  blockQuery?: BlockReference
}

export interface SetupControllerOptions {
  registrantId: string
  code: Uint8Array
  gasForCleanState?: string
  gasForInit?: string
}
