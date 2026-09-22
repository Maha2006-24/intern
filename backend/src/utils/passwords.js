import { createHash } from 'crypto';

function hashPassword(password) {
  return createHash('sha256').update(String(password || '')).digest('hex');
}

function passwordsMatch(password, passwordHash) {
  return hashPassword(password) === String(passwordHash || '');
}

export { hashPassword, passwordsMatch };
