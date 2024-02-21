import base58 from 'bs58';
import sha256 from 'sha256';

export function base58CodeHash(code: Buffer): string {
  const hash = Buffer.from(sha256(code), 'hex');
  return base58.encode(hash);
}
