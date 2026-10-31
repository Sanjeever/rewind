import SparkMD5 from 'spark-md5';
import {encode} from 'base-64';
function binary(value) {
  return value
    .split('')
    .map((character) => String.fromCharCode(character.charCodeAt(0) & 255))
    .join('');
}
export default {
  hex_md5: (value) => SparkMD5.hashBinary(binary(value)),
  b64_md5: (value) => encode(SparkMD5.hashBinary(binary(value), true)).replace(/=+$/, ''),
};
