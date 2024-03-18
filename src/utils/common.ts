import { Amount, BigNumber, BigNumberLike, BlockQuery } from 'multi-transaction';
import { SpaceshipEngine } from '../core/types/data';
import { PublicKey } from 'near-api-js/lib/utils';
import sha256 from 'sha256';
import base58 from 'bs58';

export const PENDING_REGISTRANT_ID_PREFIX = 'pending-registrant-id:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parse(0.0125, 'NEAR');
export const DEFAULT_SPACESHIP_STORAGE_DEPOSIT = Amount.parse(0.02, 'NEAR');
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;
export const MAX_TIMEOUT = 2147483647;
export const DAY_MS = 86400 * 1000;

export function base58CodeHash(code: Buffer): string {
  const hash = Buffer.from(sha256(code), 'hex');
  return base58.encode(hash);
}

export function jsonSerialize<T>(data: T): string {
  return JSON.stringify(data);
}

export function jsonDeserialize<T>(data: string): T {
  return JSON.parse(data);
}

export function optimistic(): BlockQuery {
  return { finality: 'optimistic' };
}

export function calcInsufficientBalance(current: BigNumberLike, required: BigNumberLike): BigNumber {
  return BigNumber.max(BigNumber(required).minus(current), 0);
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
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

export function getPendingRegistrantId(publicKey: string): string {
  return PENDING_REGISTRANT_ID_PREFIX + PublicKey.fromString(publicKey).toString();
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
