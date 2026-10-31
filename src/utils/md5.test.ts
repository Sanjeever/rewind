import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import md5 from './md5';
test('服务签名与封面 ID 保持旧八位字符摘要语义', () => {
  for (const value of ['', 'password', '中文', 'café', '🎵', '{"songmid":"abc","offset":0}']) {
    const digest = createHash('md5').update(Buffer.from(value, 'latin1')).digest();
    assert.equal(md5.hex_md5(value), digest.toString('hex'));
    assert.equal(md5.b64_md5(value), digest.toString('base64').replace(/=+$/, ''));
  }
});
