import {NearWalletParams} from "@near-wallet-selector/near-wallet";
import {MyNearWalletParams} from "@near-wallet-selector/my-near-wallet";
import {SenderParams} from "@near-wallet-selector/sender";

export interface NearWallet {
  type: 'NearWallet',
  config?: NearWalletParams
}

export interface MyNearWallet {
  type: 'MyNearWallet',
  config?: MyNearWalletParams
}

export interface Sender {
  type: 'Sender',
  config?: SenderParams
}

export type WalletModule = NearWallet | MyNearWallet | Sender
