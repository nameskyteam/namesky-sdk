import {NiceNearNameConfig} from "../../nnn-sdk/src";

export interface Config {
  nnn: NiceNearNameConfig
}

export const config: Config = {
  nnn: {
    selector: {
      network: 'testnet',
      modules:[
        { type: "NearWallet" }
      ],
      keyStorePrefix: 'registrant:keystore:'
    },
    contracts: {
      nftContractId: 'nft.nicenearname.testnet',
      marketContractId: 'market.nicenearname.testnet'
    }
  }
}
