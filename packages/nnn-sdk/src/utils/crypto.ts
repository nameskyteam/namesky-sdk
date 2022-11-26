import CryptoJS from "crypto-js";
import base58 from "bs58";

export function sha256Encoding(data: Uint8Array): Uint8Array {
  const words = CryptoJS.lib.WordArray.create(data as any)
  const hex = CryptoJS.SHA256(words).toString()
  return Buffer.from(hex, 'hex')
}

export function base58CryptoHash(cryptoHash: Uint8Array): string {
  return base58.encode(cryptoHash)
}
