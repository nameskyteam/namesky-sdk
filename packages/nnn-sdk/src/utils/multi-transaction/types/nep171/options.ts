import {SpecificFunctionCallOptions} from "../common";
import {NftApproveArgs, NftRevokeAllArgs, NftRevokeArgs, NftTransferArgs, NftTransferCallArgs} from "./args";

export type NftTransferOptions = Omit<SpecificFunctionCallOptions<NftTransferArgs>, 'attachedDeposit'>

export type NftTransferCallOptions = Omit<SpecificFunctionCallOptions<NftTransferCallArgs>, 'attachedDeposit'>

export type NftApproveOptions = Omit<SpecificFunctionCallOptions<NftApproveArgs>, ''>

export type NftRevokeOptions = Omit<SpecificFunctionCallOptions<NftRevokeArgs>, 'attachedDeposit'>

export type NftRevokeAllOptions = Omit<SpecificFunctionCallOptions<NftRevokeAllArgs>, 'attachedDeposit'>
