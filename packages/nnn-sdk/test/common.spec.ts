import sha256 from "sha256";

test("", () => {
  const code = new Uint8Array()
  const hash = sha256(code.buffer as Buffer)
  console.log(hash)
})
