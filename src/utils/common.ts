import { Amount, BigNumber } from 'multi-transaction';
import { SpaceshipEngine } from '../core/types/data';
import { Network, NetworkId } from '../core';

export const REQUEST_ACCESS_PENDING_KEY_PREFIX = 'request_access_pending_key:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parse(0.0125, 'NEAR');
export const DEFAULT_APPROVAL_STORAGE_DEPOSIT = Amount.parse(0.005, 'NEAR');
export const DEFAULT_SPACESHIP_STORAGE_DEPOSIT = Amount.parse(0.02, 'NEAR');
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;
export const MAX_TIMEOUT = 2147483647;
export const DAY_MS = 86400 * 1000;

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function resolveNetwork(network: Network | NetworkId): Network {
  if (typeof network === 'string') {
    network = {
      networkId: network,
      nodeUrl: getDefaultNodeUrl(network),
    };
  }
  return network;
}

export function getDefaultNodeUrl(networkId: NetworkId): string {
  switch (networkId) {
    case 'mainnet':
      return 'https://archival-rpc.mainnet.near.org';
    case 'testnet':
      return 'https://archival-rpc.testnet.near.org';
  }
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function wait<T>(f: () => Promise<T>, timeout: number = MAX_TIMEOUT): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const reject = async (): Promise<never> =>
    await new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(`Exceed max timeout: ${timeout}`), timeout);
    });

  return Promise.race([reject(), f()]).finally(() => clearTimeout(timeoutId));
}

export function moveRegistrantPublicKeyToEnd(registrantPublicKey: string, publicKeys: string[]): string[] {
  const result: string[] = [];
  for (const publicKey of publicKeys) {
    if (publicKey !== registrantPublicKey) {
      result.push(publicKey);
    }
  }
  result.push(registrantPublicKey);
  return result;
}

export function simulateSettleEnergy(spaceshipEngine: SpaceshipEngine, settledAt: number): SpaceshipEngine {
  if (settledAt < spaceshipEngine.settled_at) {
    throw Error('Invalid settled timestamp');
  }

  const consumedEnergy = BigNumber.min(
    BigNumber(settledAt - spaceshipEngine.settled_at)
      .multipliedBy(spaceshipEngine.speed)
      .div(DAY_MS)
      .decimalPlaces(0),
    BigNumber(spaceshipEngine.energy)
  );

  spaceshipEngine = {
    added_fuel_num: spaceshipEngine.added_fuel_num,
    energy: BigNumber(spaceshipEngine.energy).minus(consumedEnergy).toFixed(),
    consumed_energy: BigNumber(spaceshipEngine.consumed_energy).plus(consumedEnergy).toFixed(),
    speed: spaceshipEngine.speed,
    settled_at: settledAt,
  };

  if (spaceshipEngine.energy === '0') {
    spaceshipEngine.speed = '0';
  }

  return spaceshipEngine;
}
