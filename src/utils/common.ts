import { BigNumber } from 'multi-transaction';
import { SpaceshipEngine } from '../core';
import sha256 from 'sha256';
import base58 from 'bs58';
import { DAY_MS, MAX_TIMEOUT } from './constants';

export function base58CodeHash(code: Buffer): string {
  const hash = Buffer.from(sha256(code), 'hex');
  return base58.encode(hash);
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

export function jsonSerialize<T>(data: T): string {
  return JSON.stringify(data);
}

export function jsonDeserialize<T>(data: string): T {
  return JSON.parse(data);
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
