import Big, {BigSource} from "big.js";

export type GasSource = Gas | BigSource;

export class Gas {
  inner: Big

  static ONE_TERA = Gas.new('1000000000000');
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

  // If gas is not integer, will be fixed to integer
  toFixed(): string {
    return this.inner.toFixed(0, Big.roundDown);
  }

  static tera(_: number): string {
    return Gas.ONE_TERA.mul(_).toFixed();
  }
}
