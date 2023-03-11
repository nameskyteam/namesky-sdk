import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { UserSettingContract } from '../contracts/UserSettingContract';
import { MultiSendWalletSelector, MultiSendWalletSelectorConfig } from 'multi-transaction';

export interface NameSkyComponent {
  selector: MultiSendWalletSelector;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
}

export interface NameSkyConfig {
  selectorConfig: MultiSendWalletSelectorConfig;
  contractsConfig: {
    coreContractId: string;
    marketplaceContractId: string;
    userSettingContractId: string;
  };
}
