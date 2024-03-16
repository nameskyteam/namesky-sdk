import { NetworkId } from '../core';

export function getCoreContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'core.namesky.near';
    case 'testnet':
      return 'core.namesky.testnet';
  }
}

export function getMarketplaceContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'marketplace.namesky.near';
    case 'testnet':
      return 'marketplace.namesky.testnet';
  }
}

export function getUserSettingContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'login.namesky.near';
    case 'testnet':
      return 'login.namesky.testnet';
  }
}

export function getSpaceshipContractId(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'namesky_spaceship.near';
    case 'testnet':
      return 'namesky_spaceship.testnet';
  }
}
