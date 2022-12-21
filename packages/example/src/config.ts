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
      coreContractId: 'core.namesky.testnet',
      marketplaceContractId: 'core.namesky.testnet'
    }
  }
}
