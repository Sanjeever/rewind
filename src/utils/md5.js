const SparkMD5 = require('spark-md5');
const {encode} = require('base-64');

function binary(value) {
  return value
    .split('')
    .map((character) => String.fromCharCode(character.charCodeAt(0) & 255))
    .join('');
}

module.exports = {
  hex_md5: (value) => SparkMD5.hashBinary(binary(value)),
  b64_md5: (value) => encode(SparkMD5.hashBinary(binary(value), true)).replace(/=+$/, ''),
};
