import Big from 'big.js';
import { NEAR_DECIMALS, pow } from './common';

export class Amount {
  private constructor() {}

  static ZERO = '0';
  static ONE_YOCTO = '1';
  static ONE_NEAR = Amount.parseYoctoNear('1');

  static parse(readable: string, decimals: number): string {
    return Amount.parseBig(Big(readable), decimals).toFixed();
  }

  static parseBig(readable: Big, decimals: number): Big {
    return readable.mul(pow(10, decimals)).round(0, Big.roundDown);
  }

  static format(amount: string, decimals: number, round?: number): string {
    return Amount.formatBig(Big(amount), decimals, round).toFixed();
  }

  static formatBig(amount: Big, decimals: number, round?: number): Big {
    return amount.div(pow(10, decimals)).round(round, Big.roundDown);
  }

  static parseYoctoNear(readable: string): string {
    return Amount.parse(readable, NEAR_DECIMALS);
  }

  static formatYoctoNear(amount: string, round: number): string {
    return Amount.format(amount, NEAR_DECIMALS, round);
  }
}
