import sha256 from "sha256";
import base58 from "bs58";

export function sha256Encoding(data: Uint8Array): Uint8Array {
  const hex = sha256(data as Buffer)
  return Buffer.from(hex, 'hex')
}

export function base58CryptoHash(cryptoHash: Uint8Array): string {
  return base58.encode(cryptoHash)
}
