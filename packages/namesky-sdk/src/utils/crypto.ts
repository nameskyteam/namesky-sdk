import CryptoJS from 'crypto-js';
import base58 from 'bs58';

function bufferToWordArray(data: Buffer): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Hex.parse(data.toString('hex'));
}

function wordArrayToBuffer(data: CryptoJS.lib.WordArray): Buffer {
  return Buffer.from(data.toString(CryptoJS.enc.Hex), 'hex');
}

export function sha256(data: Buffer): Buffer {
  const bytes = bufferToWordArray(data);
  const hash = CryptoJS.SHA256(bytes);
  return wordArrayToBuffer(hash);
}

export function base58CryptoHash(cryptoHash: Buffer): string {
  return base58.encode(cryptoHash);
}
