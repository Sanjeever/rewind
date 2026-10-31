import {jest} from '@jest/globals';
import {getSecuritySign} from './sign';

test('QQ 请求签名保留旧 UTF-8 摘要、随机前缀长度与字符选择', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.25);
  const cases = [
    ['', 'zzajjjjjjjjjjjd42d5044c3a3a3cb9ddcfe5bcc4f6806'],
    ['password', 'zzajjjjjjjjjjj58c5d9ec106659c07a5adb2587e40d39'],
    ['中文', 'zzajjjjjjjjjjj81805f17a4b98a81d53afc0f2faa4f5c'],
    ['café', 'zzajjjjjjjjjjj60303aec71fd13ca73b14c9fa52d98f4'],
    ['🎵', 'zzajjjjjjjjjjjf2493dcdf43c86c77a19946b94fd2141'],
    ['{"songmid":"abc","offset":0}', 'zzajjjjjjjjjjj5008197c5e69e7ddeedba1966f002ed8'],
  ];
  for (const [input, expected] of cases) expect(getSecuritySign(input)).toBe(expected);
});
