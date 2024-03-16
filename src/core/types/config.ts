import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { SpaceshipContract } from '../contracts/SpaceshipContract';
import { Account, keyStores } from 'near-api-js';
import { WalletSelector } from '@near-wallet-selector/core';

export interface NameSkyComponent {
  network: Network;
  keyStore: keyStores.KeyStore;

  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;
}

export interface Network {
  networkId: NetworkId;
  nodeUrl: string;
}

export type NetworkId = 'mainnet' | 'testnet';

export interface NameSkyConfig {
  network: Network | NetworkId;
  signer: Account | WalletSelector;
  contracts?: {
    coreContractId?: string;
    marketplaceContractId?: string;
    userSettingContractId?: string;
    spaceshipContractId?: string;
  };
}
