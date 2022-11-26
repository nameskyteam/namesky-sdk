import {getBase58CodeHash} from "../src";

test("Test get base58 code hash", () => {
  const hash = getBase58CodeHash(Uint8Array.from([]))
  console.log(hash)
})
