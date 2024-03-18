import { NftApproveArgs, NftRevokeArgs, NftTransferArgs } from 'multi-transaction';
import {
  AcceptOfferingArgs,
  AddFuelArgs,
  BuyListingArgs,
  CreateListingArgs,
  CreateMarketAccountArgs,
  CreateOfferingArgs,
  LikeArgs,
  NearDepositArgs,
  NearWithdrawArgs,
  NftRedeemArgs,
  NftUnregisterArgs,
  ReadNotificationAtArgs,
  RemoveListingArgs,
  RemoveOfferingArgs,
  UnlikeArgs,
  UnwatchArgs,
  UpdateListingArgs,
  UpdateOfferingArgs,
  WatchArgs,
} from './args';

type ChangeFunctionExtraOptions = {
  callbackUrl?: string;
};

// ---------------------------------------------- Registrant ---------------------------------------------------

export type NftRegisterOptions = {
  registrantId: string;
  gasForRegister?: string;
};

export type SetupControllerOptions = {
  registrantId: string;
  gasForCleanState?: string;
  gasForInit?: string;
};

export type WaitForMintingOptions = {
  registrantId: string;
  timeout?: number;
};

export type OneClickMintOptions = {
  registrantId: string;
  gasForRegister?: string;
  gasForCleanState?: string;
  gasForInit?: string;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftUnregisterOptions = ChangeFunctionExtraOptions & {
  args: NftUnregisterArgs;
  gas?: string;
};

export type NftRedeemOptions = ChangeFunctionExtraOptions & {
  args: NftRedeemArgs;
  gas?: string;
};

export type NftTransferOptions = ChangeFunctionExtraOptions & {
  args: NftTransferArgs;
  gas?: string;
};

export type NftApproveOptions = ChangeFunctionExtraOptions & {
  args: NftApproveArgs;
  approvalStorageDeposit?: string;
  gas?: string;
};

export type NftRevokeOptions = ChangeFunctionExtraOptions & {
  args: NftRevokeArgs;
  gas?: string;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type CreateMarketAccountOption = ChangeFunctionExtraOptions & {
  args?: CreateMarketAccountArgs;
  marketStorageDeposit?: string;
  gas?: string;
};

export type NearDepositOptions = ChangeFunctionExtraOptions & {
  args?: NearDepositArgs;
  attachedDeposit: string;
  gas?: string;
};

export type NearWithdrawOptions = ChangeFunctionExtraOptions & {
  args?: NearWithdrawArgs;
  gas?: string;
};

export type BuyListingOptions = ChangeFunctionExtraOptions & {
  args: BuyListingArgs;
  gas?: string;
};

export type CreateListingOptions = ChangeFunctionExtraOptions & {
  args: CreateListingArgs;
  listingStorageDeposit?: string;
  approvalStorageDeposit?: string;
  gas?: string;
};

export type UpdateListingOptions = ChangeFunctionExtraOptions & {
  args: UpdateListingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
};

export type RemoveListingOptions = ChangeFunctionExtraOptions & {
  args: RemoveListingArgs;
  gas?: string;
};

export type AcceptOfferingOptions = ChangeFunctionExtraOptions & {
  args: AcceptOfferingArgs;
  approvalStorageDeposit?: string;
  gas?: string;
};

export type CreateOfferingOptions = ChangeFunctionExtraOptions & {
  args: CreateOfferingArgs;
  offeringStorageDeposit?: string;
  gas?: string;
};

export type UpdateOfferingOptions = ChangeFunctionExtraOptions & {
  args: UpdateOfferingArgs;
  gas?: string;
};

export type RemoveOfferingOptions = ChangeFunctionExtraOptions & {
  args: RemoveOfferingArgs;
  gas?: string;
};

// ---------------------------------------------- User Setting --------------------------------------------------

export type LikeOptions = ChangeFunctionExtraOptions & {
  args: LikeArgs;
  gas?: string;
};

export type UnlikeOptions = ChangeFunctionExtraOptions & {
  args: UnlikeArgs;
  gas?: string;
};

export type WatchOptions = ChangeFunctionExtraOptions & {
  args: WatchArgs;
  gas?: string;
};

export type UnwatchOptions = ChangeFunctionExtraOptions & {
  args: UnwatchArgs;
  gas?: string;
};

export type ReadNotificationAtOptions = ChangeFunctionExtraOptions & {
  args?: ReadNotificationAtArgs;
  gas?: string;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type MintSpaceshipOptions = ChangeFunctionExtraOptions & {
  spaceshipStorageDeposit?: string;
  gas?: string;
};

export type AddFuelOptions = ChangeFunctionExtraOptions & {
  args: AddFuelArgs;
  gas?: string;
};

export type DistributeAndClaimRewardsOptions = ChangeFunctionExtraOptions & {
  skyTokenId: string;
  gasForDistribute?: string;
  gasForClaim?: string;
};
