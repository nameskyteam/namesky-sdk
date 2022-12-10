import Big from 'big.js';

export class Amount {
  private constructor() {}

  static ZERO = '0';
  static ONE_YOCTO = '1';
  static ONE_NEAR = Amount.parseYoctoNear('1');

  static parse(readable: string, decimals: number): string {
    return Big(readable).mul(Big(10).pow(decimals)).toFixed(0, Big.roundDown);
  }

  static format(amount: string, decimals: number, round: number): string {
    return Big(amount).div(Big(10).pow(decimals)).toFixed(round, Big.roundDown);
  }

  static parseYoctoNear(readable: string): string {
    return Amount.parse(readable, 24);
  }

  static formatYoctoNear(amount: string, round: number): string {
    return Amount.format(amount, 24, round);
  }
}
