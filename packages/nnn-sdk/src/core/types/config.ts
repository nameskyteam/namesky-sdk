import {WalletSelectorPlus} from "../../utils";
import {NftContract} from "../contracts";
import {MarketContract} from "../contracts";
import {WalletSelectorPlusConfig} from "../../utils";

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
