import {FunctionCallOptions} from "../../utils";
import {NftRegisterArgs} from "./args";

export interface SetupControllerOptions {
  registrantId: string
  code: Uint8Array
  gasForCleanState?: string
  gasForInit?: string
}

export interface NftRegisterOptions extends FunctionCallOptions<NftRegisterArgs> {
  registrantId: string
}
