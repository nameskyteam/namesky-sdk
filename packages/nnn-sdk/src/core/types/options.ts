import {CreateOfferingArgs, GetAccountViewOfArgs, NftIsRegisteredArgs, NftRedeemArgs} from "./args";
import {SpecificFunctionCallOptions, SpecificFunctionViewOptions} from "../../utils";

export interface SetupControllerOptions {
  registrantId: string
  code: Uint8Array
  gasForCleanState?: string
  gasForInit?: string
}

export type NftRegisterOptions = Omit<SpecificFunctionCallOptions<NftIsRegisteredArgs>, 'attachedDeposit'> & {
  registrantId: string
}

export type NftRedeemOptions = Omit<SpecificFunctionCallOptions<NftRedeemArgs>, 'attachedDeposit'>

export type CreateOfferingOptions = Omit<SpecificFunctionCallOptions<CreateOfferingArgs>, 'attachedDeposit'>

export type NftIsRegisteredOptions = SpecificFunctionViewOptions<NftIsRegisteredArgs>

export type GetAccountViewOfOptions = SpecificFunctionViewOptions<GetAccountViewOfArgs>
