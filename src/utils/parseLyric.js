const {Lrc} = require('lrc-kit');

Object.defineProperty(exports, '__esModule', {value: true});
exports.default = function parseLyric(text) {
  return Lrc.parse(text)
    .lyrics.filter((line) => line.content.trim().length > 0)
    .sort((left, right) => left.timestamp - right.timestamp)
    .map(({timestamp, content}) => ({
      min: Math.floor(timestamp / 60),
      sec: Math.floor(timestamp % 60),
      ms: Math.round((timestamp - Math.floor(timestamp)) * 1000),
      txt: content.trim(),
      dis: false,
      total: timestamp,
    }));
};
