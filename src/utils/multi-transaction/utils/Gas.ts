import Big, { BigSource } from 'big.js';

export type GasSource = Gas | BigSource;

export class Gas {
  inner: Big;

  static DEFAULT = Gas.tera(30);

  private constructor(n: GasSource) {
    this.inner = new Big(n instanceof Gas ? n.inner : n);
  }

  static new(n: GasSource): Gas {
    return new Gas(n);
  }

  mul(n: GasSource): Gas {
    return Gas.new(this.inner.mul(n instanceof Gas ? n.inner : n));
  }

  div(n: GasSource): Gas {
    return Gas.new(this.inner.div(n instanceof Gas ? n.inner : n));
  }

  add(n: GasSource): Gas {
    return Gas.new(this.inner.add(n instanceof Gas ? n.inner : n));
  }

  sub(n: GasSource): Gas {
    return Gas.new(this.inner.sub(n instanceof Gas ? n.inner : n));
  }

  pow(exp: number): Gas {
    return Gas.new(this.inner.pow(exp));
  }

  mulPow(base: GasSource, exp: number): Gas {
    return this.mul(Gas.new(base).pow(exp));
  }

  divPow(base: GasSource, exp: number): Gas {
    return this.div(Gas.new(base).pow(exp));
  }

  gt(n: GasSource): boolean {
    return this.inner.gt(Gas.new(n).inner);
  }

  gte(n: GasSource): boolean {
    return this.inner.gte(Gas.new(n).inner);
  }

  lt(n: GasSource): boolean {
    return this.inner.lt(Gas.new(n).inner);
  }

  lte(n: GasSource): boolean {
    return this.inner.lte(Gas.new(n).inner);
  }

  eq(n: GasSource): boolean {
    return this.inner.eq(Gas.new(n).inner);
  }

  toFixed(): string {
    return this.inner.toFixed(0, Big.roundDown);
  }

  static parse(tera: GasSource): Gas {
    return Gas.new(tera).mulPow(10, 12);
  }

  static tera(_: GasSource): string {
    return Gas.parse(_).toFixed();
  }
}
