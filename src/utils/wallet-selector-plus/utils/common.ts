import { Network, NetworkId } from '@near-wallet-selector/core';

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
