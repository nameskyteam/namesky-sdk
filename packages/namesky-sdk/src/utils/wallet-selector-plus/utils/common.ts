import { WalletModule } from '../types';
import { Network, NetworkId, WalletModuleFactory } from '@near-wallet-selector/core';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupLedger } from '@near-wallet-selector/ledger';

export function setupWalletModules(modules: WalletModule[]) {
  return modules.map(({ type, params }): WalletModuleFactory => {
    switch (type) {
      case 'NearWallet':
        return setupNearWallet(params);
      case 'MyNearWallet':
        return setupMyNearWallet(params);
      case 'Sender':
        return setupSender(params);
      case 'Ledger':
        return setupLedger(params);
      default:
        throw Error(`Wrong wallet type: ${type}`);
    }
  });
}

export const getNetworkPreset = (networkId: NetworkId): Network => {
  switch (networkId) {
    case 'mainnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.near.org',
        indexerUrl: 'https://api.kitwallet.app',
      };
    case 'testnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-api.kitwallet.app',
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

export const resolveNetwork = (network: NetworkId | Network): Network => {
  return typeof network === 'string' ? getNetworkPreset(network) : network;
};
