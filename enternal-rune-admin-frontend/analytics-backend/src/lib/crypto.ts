import crypto from 'node:crypto';

export function generateId(prefix = ''): string {
  return prefix + crypto.randomBytes(16).toString('hex');
}

export function hash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function uuid(...args: string[]): string {
  return crypto.createHash('sha1').update(args.join('')).digest('hex').substring(0, 36);
}