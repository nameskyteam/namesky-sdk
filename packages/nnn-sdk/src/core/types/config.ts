import {WalletSelectorPlus} from "../../utils/wallet-selector-plus/types/enhancement";
import {NftContract} from "../contracts/NftContract";
import {MarketContract} from "../contracts/MarketContract";
import {WalletSelectorPlusConfig} from "../../utils/wallet-selector-plus/types/config";

export interface NiceNearNameComponent {
  selector: WalletSelectorPlus
  nftContract: NftContract
  marketContract: MarketContract
}

export interface NiceNearNameConfig {
  selector: WalletSelectorPlusConfig,
  contracts: {
    nftContractId: string,
    marketContractId: string
  }
}
