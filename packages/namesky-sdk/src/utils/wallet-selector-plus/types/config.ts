import { WalletSelectorParams } from '@near-wallet-selector/core/lib/wallet-selector.types';

export interface WalletSelectorPlusConfig extends WalletSelectorParams {
  keyStorePrefix?: string
}
