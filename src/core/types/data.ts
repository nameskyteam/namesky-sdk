import { Token } from 'multi-transaction';

// ---------------------------------------------- Controller ---------------------------------------------------

export interface NameSkyNftSafety {
  isCodeHashCorrect: boolean;
  isControllerOwnerIdCorrect: boolean;
  isStateCleaned: boolean;
  isAccessKeysDeleted: boolean;
}

// ---------------------------------------------- Core ---------------------------------------------------------

export type TokenState = 'Active' | 'OnMinting' | 'OnBurning' | Frozen;

type Frozen = { Frozen: { memo: string } };

export interface NameSkyToken extends Token {
  token_state: TokenState;
}

export interface RoyaltyView {
  royalty: number;
  divisor: number;
}

export interface ControllerCodeView {
  version: number;
  code_hash: string;
  code_len: number;
  code_memo?: string;
  is_state_broken: boolean;
}

// ---------------------------------------------- Marketplace --------------------------------------------------

export interface AccountView {
  account_id: string;
  near_balance: string;
  total_storage_balance: string;
  available_storage_balance: string;
}

export interface ListingView {
  id: string;
  listing_id: [string, string];
  seller_id: string;
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  nft_approval_id?: number;
}

export interface OfferingView {
  id: string;
  offering_id: [string, string, string];
  buyer_id: string;
  nft_contract_id: string;
  nft_token_id: string;
  price: string;
  is_simple_offering: boolean;
}

export interface Approval {
  owner_id: string;
  approval_id: number;
}

export interface MarketplaceConfig {
  // 10000 = 100.00 %
  listing_trading_fee: number;
  // 10000 = 100.00 %
  offering_trading_fee: number;
  // min storage usage
  min_storage_usage: number;
}

export interface TradingFeeRate {
  listing: number;
  offering: number;
}

// ---------------------------------------------- Spaceship ----------------------------------------------------

export interface SpaceshipEngine {
  added_fuel_num: string;
  energy: string;
  consumed_energy: string;
  speed: string;
  settled_at: number;
}
