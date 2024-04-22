import { Amount } from 'multi-transaction';

export const PENDING_REGISTRANT_ID_PREFIX = 'pending-registrant-id:';
export const REGISTRANT_KEYSTORE_PREFIX = 'registrant:keystore:';
export const DEFAULT_MARKET_STORAGE_DEPOSIT = Amount.parse(0.015, 'NEAR');
export const DEFAULT_SPACESHIP_STORAGE_DEPOSIT = Amount.parse(0.02, 'NEAR');
export const FEE_DIVISOR = 10000;
export const ACTION_MAX_NUM = 100;
export const MAX_TIMEOUT = 2147483647;
export const DAY_MS = 86400 * 1000;
