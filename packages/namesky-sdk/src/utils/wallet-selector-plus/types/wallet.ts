import { NearWalletParams } from '@near-wallet-selector/near-wallet';
import { MyNearWalletParams } from '@near-wallet-selector/my-near-wallet';
import { SenderParams } from '@near-wallet-selector/sender';
import { LedgerParams } from '@near-wallet-selector/ledger';

export type WalletModule = NearWallet | MyNearWallet | Sender | Ledger;

export interface NearWallet {
  type: 'NearWallet';
  params?: NearWalletParams;
}

export interface MyNearWallet {
  type: 'MyNearWallet';
  params?: MyNearWalletParams;
}

export interface Sender {
  type: 'Sender';
  params?: SenderParams;
}

export interface Ledger {
  type: 'Ledger';
  params?: LedgerParams;
}
