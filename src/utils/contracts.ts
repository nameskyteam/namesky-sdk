import { NameSkyConfigurationError } from '../errors';
import { NetworkId } from '../types';

export function getDefaultCoreContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'core.namesky.near';
    case 'testnet':
      return 'core.namesky.testnet';
    default:
      throw new NameSkyConfigurationError(`Default core contract id not found for network: ${networkId}`);
  }
}

export function getDefaultMarketplaceContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'marketplace.namesky.near';
    case 'testnet':
      return 'marketplace.namesky.testnet';
    default:
      throw new NameSkyConfigurationError(`Default marketplace contract id not found for network: ${networkId}`);
  }
}

export function getDefaultUserSettingContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'login.namesky.near';
    case 'testnet':
      return 'login.namesky.testnet';
    default:
      throw new NameSkyConfigurationError(`Default user setting contract id not found for network: ${networkId}`);
  }
}
