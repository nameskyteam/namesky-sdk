import {getBase58CodeHash} from "../src";

test("Test get base58 code hash", () => {
  const hash = getBase58CodeHash(Buffer.from([]))
  expect("GKot5hBsd81kMupNCXHaqbhv3huEbxAFMLnpcX2hniwn").toEqual(hash)
})
