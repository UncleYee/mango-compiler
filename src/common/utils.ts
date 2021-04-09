import crypto from 'crypto';

// new RegExp
export function getSafeRegExp(str: string) {
  let regExp: RegExp;
  try {
    regExp = new RegExp(str);
  } catch (e) {
    regExp = /(?:)/;
  }
  return regExp;
}

export function hashString(str = '') {
  const hash = crypto.createHash('sha256');
  return hash.update(str).digest('hex');
}
