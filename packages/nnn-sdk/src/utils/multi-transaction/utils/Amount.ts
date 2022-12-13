import Big, { BigSource } from 'big.js';
import { NEAR_DECIMALS, pow } from './common';

export class Amount {
  private constructor() {}

  static ZERO = '0';
  static ONE_YOCTO = '1';
  static ONE_NEAR = Amount.parseYoctoNear('1');

  static parseStr(readable: BigSource, decimals: number): string {
    return Amount.parseBig(readable, decimals).toFixed();
  }

  static parseBig(readable: BigSource, decimals: number): Big {
    return Big(readable).mul(pow(10, decimals)).round(0, Big.roundDown);
  }

  static formatStr(amount: BigSource, decimals: number, round?: number): string {
    return Amount.formatBig(amount, decimals, round).toFixed();
  }

  static formatBig(amount: BigSource, decimals: number, round?: number): Big {
    return Big(amount).div(pow(10, decimals)).round(round, Big.roundDown);
  }

  static parseYoctoNear(readable: string): string {
    return Amount.parseStr(readable, NEAR_DECIMALS);
  }

  static formatYoctoNear(amount: string, round: number): string {
    return Amount.formatStr(amount, NEAR_DECIMALS, round);
  }
}
