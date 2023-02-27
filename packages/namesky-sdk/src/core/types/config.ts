import { WalletSelectorPlus } from '../../utils';
import { CoreContract } from '../contracts';
import { MarketplaceContract } from '../contracts';
import { WalletSelectorPlusConfig } from '../../utils';
import { UserSettingContract } from '../contracts/UserSettingContract';

export interface NameSkyComponent {
  selector: WalletSelectorPlus;
  coreContract: CoreContract;
  marketplaceContract: MarketplaceContract;
  userSettingContract: UserSettingContract;
}

export interface NameSkyConfig {
  selectorConfig: WalletSelectorPlusConfig;
  contractsConfig: {
    coreContractId: string;
    marketplaceContractId: string;
    userSettingContractId: string;
  };
}
