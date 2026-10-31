import assert from 'node:assert/strict';
import parseLyric from './parseLyric';
test('零秒歌词、十分钟时间与不同小数精度保持正确时间', () => {
  const lines = parseLyric(
    '[ar:歌手]\r\n[10:01.2]结尾\r\n[00:00.00]开头\r\n[00:09.01]第二行\r\n[00:10.123]第三行',
  );
  assert.deepEqual(
    lines.map(({total, txt}) => ({
      total,
      txt,
    })),
    [
      {
        total: 0,
        txt: '开头',
      },
      {
        total: 9.01,
        txt: '第二行',
      },
      {
        total: 10.123,
        txt: '第三行',
      },
      {
        total: 601.2,
        txt: '结尾',
      },
    ],
  );
  assert.deepEqual([lines[3].min, lines[3].sec, lines[3].ms], [10, 1, 200]);
});
test('一行多个时间标签展开为可同步的独立歌词行', () => {
  assert.deepEqual(
    parseLyric('[00:30.000][00:09.010][01:05.5] 重复歌词').map(({total, txt}) => [total, txt]),
    [
      [9.01, '重复歌词'],
      [30, '重复歌词'],
      [65.5, '重复歌词'],
    ],
  );
});
test('元信息与无时间内容不会伪造为同步歌词', () => {
  assert.deepEqual(parseLyric('[ti:标题]\n[ar:歌手]\n未标记时间的内容\n[00:12.00]  '), []);
  assert.deepEqual(parseLyric(''), []);
});
