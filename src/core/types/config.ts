import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { MultiSendWalletSelector, MultiSendWalletSelectorConfig } from 'multi-transaction';
import { SpaceshipContract } from '../contracts/SpaceshipContract';

export interface NameSkyComponent {
  selector: MultiSendWalletSelector;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
  spaceshipContract: SpaceshipContract;
}

export interface NameSkyConfig {
  selectorConfig: MultiSendWalletSelectorConfig;
  contractsConfig: {
    coreContractId: string;
    marketplaceContractId: string;
    userSettingContractId: string;
    spaceshipContractId: string;
  };
}
