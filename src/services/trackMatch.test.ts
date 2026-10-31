import {findMatchingTrack} from './trackMatch';
test('匹配同时核对名称、歌手、版本与时长，不能回退搜索首项', () => {
  const source = {name: 'Hello', ar: [{name: 'Adele'}], dt: 295000};
  const live = {name: 'Hello (Live)', singer: [{name: 'Adele'}], interval: 295};
  const cover = {name: 'Hello', singer: [{name: '其他歌手'}], interval: 295};
  const short = {name: 'Hello', singer: [{name: 'Adele'}], interval: 180};
  const correct = {name: 'HELLO', singer: [{name: 'Adele'}], interval: 294};
  expect(findMatchingTrack(source, [live, cover, short, correct])).toBe(correct);
  expect(findMatchingTrack(source, [live, cover, short])).toBeUndefined();
  expect(findMatchingTrack({name: 'Hello'}, [correct])).toBeUndefined();
});
