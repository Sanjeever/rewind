import base64 from 'base-64';
import SparkMD5 from 'spark-md5';
import md5 from '../../utils/md5';

const mask = [212, 45, 80, 68, 195, 163, 163, 203, 157, 220, 254, 91, 204, 79, 104, 6];
const prefixIndices = [21, 4, 9, 26, 16, 20, 27, 30];
const suffixIndices = [18, 11, 3, 2, 1, 7, 6, 25];

export function qmSign(value: string) {
  const digest = md5.hex_md5(value).toLowerCase();
  const bytes = mask.map(
    (byte, index) => byte ^ parseInt(digest.slice(2 * index, 2 * index + 2), 16),
  );
  const prefix = prefixIndices.map((index) => digest[index]).join('');
  const suffix = suffixIndices.map((index) => digest[index]).join('');
  const encoded = base64
    .encode(String.fromCodePoint(...bytes))
    .replace(/=+$/, '')
    .replace(/[/+]/g, '')
    .toLowerCase();
  return `zzb${prefix}${encoded}${suffix}`;
}

export function getSecuritySign(value: string) {
  const length = Math.floor(7 * Math.random() + 10);
  let prefix = 'zza';
  for (let index = 0; index < length; index++) {
    prefix += 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(36 * Math.random())];
  }
  return prefix + SparkMD5.hash(`CJBPACrRuNy7${value}`);
}
