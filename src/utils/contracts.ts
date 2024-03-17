import { NetworkId } from '../core';

export function getDefaultCoreContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'core.namesky.near';
    case 'testnet':
      return 'core.namesky.testnet';
    default:
      throw Error(`Default core contract id not found for network: ${networkId}`);
  }
}

export function getDefaultMarketplaceContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'marketplace.namesky.near';
    case 'testnet':
      return 'marketplace.namesky.testnet';
    default:
      throw Error(`Default marketplace contract id not found for network: ${networkId}`);
  }
}

export function getDefaultUserSettingContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'login.namesky.near';
    case 'testnet':
      return 'login.namesky.testnet';
    default:
      throw Error(`Default user setting contract id not found for network: ${networkId}`);
  }
}

export function getDefaultSpaceshipContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'namesky_spaceship.near';
    case 'testnet':
      return 'namesky_spaceship.testnet';
    default:
      throw Error(`Default spaceship contract id not found for network: ${networkId}`);
  }
}
