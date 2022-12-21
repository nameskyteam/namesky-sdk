import {Amount} from "./Amount";

export class Gas {
  private constructor() {}

  private static ONE_TERA = Amount.new('1000000000000');
  static DEFAULT = Gas.tera(30);

  static tera(_: number): string {
    return Gas.ONE_TERA.mul(_).toFixed(0);
  }
}
