import crypto from "node:crypto";

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

/**
 * Derives a cryptographic hash and salt for an access key
 */
export function hashAccessKey(key: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(key, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");
  return { hash, salt };
}

/**
 * Verifies if an entered access key matches the stored hash
 */
export function verifyAccessKey(key: string, storedHash: string, salt: string): boolean {
  if (!key || !storedHash || !salt) return false;
  const { hash } = hashAccessKey(key, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

/**
 * Rate Limiting Tracker for the Layer 1 Gate and Public Forms
 */
interface RateLimitEntry {
  attempts: number;
  lockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    rateLimitMap.set(identifier, { attempts: 1, lockedUntil: 0 });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (entry.lockedUntil > now) {
    const retryAfterSec = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  // If window expired, reset
  if (entry.attempts >= maxAttempts) {
    entry.lockedUntil = now + windowMs;
    const retryAfterSec = Math.ceil(windowMs / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  entry.attempts += 1;
  return { allowed: true, remainingAttempts: maxAttempts - entry.attempts };
}

export function resetRateLimit(identifier: string) {
  rateLimitMap.delete(identifier);
}

/**
 * Sanitizes rich text content to prevent script injections
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:[^"']*/g, "");
}
