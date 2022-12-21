import Big, { BigSource } from 'big.js';

export type AmountSource = Amount | BigSource;

// 0: Amount.roundDown
// 1: Amount.roundHalfUp
// 2: Amount.roundHalfEven
// 3: Amount.roundUp
export type RoundingMode = 0 | 1 | 2 | 3;

export class Amount {
  inner: Big;

  static NEAR_LIKE_DECIMALS = 24;
  static ZERO = '0';
  static ONE_YOCTO = '1';
  static ONE_NEAR = Amount.parse(1, Amount.NEAR_LIKE_DECIMALS);

  static roundDown: RoundingMode = Big.roundDown;
  static roundHalfUp: RoundingMode = Big.roundHalfUp;
  static roundHalfEven: RoundingMode = Big.roundHalfEven;
  static roundUp: RoundingMode = Big.roundUp;

  private constructor(n: AmountSource) {
    this.inner = new Big(n instanceof Amount ? n.inner : n);
  }

  static new(n: AmountSource): Amount {
    return new Amount(n);
  }

  mul(n: AmountSource): Amount {
    return Amount.new(this.inner.mul(n instanceof Amount ? n.inner : n));
  }

  div(n: AmountSource): Amount {
    return Amount.new(this.inner.div(n instanceof Amount ? n.inner : n));
  }

  add(n: AmountSource): Amount {
    return Amount.new(this.inner.add(n instanceof Amount ? n.inner : n));
  }

  sub(n: AmountSource): Amount {
    return Amount.new(this.inner.sub(n instanceof Amount ? n.inner : n));
  }

  pow(exp: number): Amount {
    return Amount.new(this.inner.pow(exp));
  }

  mulPow(base: AmountSource, exp: number): Amount {
    return this.mul(Amount.new(base).pow(exp));
  }

  divPow(base: AmountSource, exp: number): Amount {
    return this.div(Amount.new(base).pow(exp));
  }

  gt(n: AmountSource): boolean {
    return this.inner.gt(Amount.new(n).inner);
  }

  gte(n: AmountSource): boolean {
    return this.inner.gte(Amount.new(n).inner);
  }

  lt(n: AmountSource): boolean {
    return this.inner.lt(Amount.new(n).inner);
  }

  lte(n: AmountSource): boolean {
    return this.inner.lte(Amount.new(n).inner);
  }

  eq(n: AmountSource): boolean {
    return this.inner.eq(Amount.new(n).inner);
  }

  sqrt() {
    return this.inner.sqrt();
  }

  static max(...values: AmountSource[]): Amount {
    return values
      .map((n) => Amount.new(n))
      .sort((n1, n2) => {
        if (n1.gte(n2)) {
          return -1;
        }
        return 1;
      })[0];
  }

  static min(...values: AmountSource[]): Amount {
    return values
      .map((n) => Amount.new(n))
      .sort((n1, n2) => {
        if (n1.lte(n2)) {
          return -1;
        }
        return 1;
      })[0];
  }

  // dp: required, decimal places
  // rm: optional, rounding mod, default `Amount.roundDown`
  round(dp: number, rm?: RoundingMode): Amount {
    return new Amount(this.inner.round(dp, rm ?? Amount.roundDown));
  }

  // dp: optional, decimal places, if not provided, will keep as many decimal places as possible
  // rm: optional, rounding mod, default `Amount.roundDown`
  toFixed(dp?: number, rm?: RoundingMode): string {
    return this.inner.toFixed(dp, rm ?? Amount.roundDown);
  }

  static parse(readable: AmountSource, decimals: number, overflow?: RoundingMode): Amount {
    return Amount.new(readable).mulPow(10, decimals).round(0, overflow);
  }

  static format(amount: AmountSource, decimals: number): Amount {
    return Amount.new(amount).divPow(10, decimals);
  }

  static parseYoctoNear(readable: AmountSource, overflow?: RoundingMode): string {
    return Amount.parse(readable, Amount.NEAR_LIKE_DECIMALS, overflow).toFixed();
  }

  static formatYoctoNear(amount: AmountSource, dp?: number, rm?: RoundingMode): string {
    return Amount.format(amount, Amount.NEAR_LIKE_DECIMALS).toFixed(dp, rm);
  }
}
