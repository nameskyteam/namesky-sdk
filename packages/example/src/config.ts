import {NameSkyConfig} from "../../namesky-sdk/src";

export interface Config {
  namesky: NameSkyConfig
}

export const config: Config = {
  namesky: {
    selector: {
      network: 'testnet',
      modules:[
        { type: "NearWallet" }
      ],
      keyStorePrefix: 'registrant:keystore:'
    },
    contracts: {
      nftContractId: 'core.namesky.testnet',
      marketContractId: 'core.namesky.testnet'
    }
  }
}
