// ---------------------------------------------- Controller ---------------------------------------------------

// ---------------------------------------------- Core ---------------------------------------------------------
import { Token } from '../../utils';

export type TokenState = 'Active' | 'Minting' | 'Redeeming' | Frozen;

type Frozen = { Frozen: { memo: string } };

export interface NameSkyToken extends Token {
  token_state: TokenState;
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
