import Big, { BigSource } from 'big.js';

export const NEAR_DECIMALS = 24;

export function pow(n: BigSource, exp: number): Big {
  return Big(n).pow(exp);
}
