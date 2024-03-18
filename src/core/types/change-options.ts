import { UpdateWrapper } from './args';

type ChangeFunctionExtraOptions = {
  callbackUrl?: string;
};

// ---------------------------------------------- Core ---------------------------------------------------------

export type NftUnregisterOptions = ChangeFunctionExtraOptions & {
  registrantId: string;
  publicKey: string;
  force?: boolean;
};

export type NftRedeemOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  publicKey: string;
  force?: boolean;
  memo?: string;
};

export type NftTransferOptions = ChangeFunctionExtraOptions & {
  receiverId: string;
  tokenId: string;
  approvalId?: number;
  memo?: string;
};

export type NftApproveOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  accountId: string;
  msg?: string;
};

export type NftRevokeOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  accountId: string;
};

// ---------------------------------------------- Marketplace --------------------------------------------------

export type CreateMarketAccountOption = ChangeFunctionExtraOptions & {};

export type NearDepositOptions = ChangeFunctionExtraOptions & {
  amount: string;
};

export type NearWithdrawOptions = ChangeFunctionExtraOptions & {
  amount?: string;
};

export type BuyListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type CreateListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  price: string;
  expireTime?: number;
};

export type UpdateListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  newPrice?: string;
  newExpireTime?: UpdateWrapper<number>;
};

export type RemoveListingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type AcceptOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  buyerId: string;
};

export type CreateOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  price: string;
  expireTime?: number;
  isSimpleOffering?: boolean;
};

export type UpdateOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
  newPrice?: string;
  newExpireTime?: UpdateWrapper<number>;
};

export type RemoveOfferingOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

// ---------------------------------------------- User Setting --------------------------------------------------

export type LikeOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type UnlikeOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type WatchOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type UnwatchOptions = ChangeFunctionExtraOptions & {
  tokenId: string;
};

export type ReadNotificationAtOptions = ChangeFunctionExtraOptions & {
  timestamp?: string;
};

// ---------------------------------------------- Spaceship -----------------------------------------------------

export type MintSpaceshipOptions = ChangeFunctionExtraOptions & {};

export type AddFuelOptions = ChangeFunctionExtraOptions & {
  quantity: string;
};

export type ClaimRewardsOptions = ChangeFunctionExtraOptions & {
  skyTokenId: string;
};
