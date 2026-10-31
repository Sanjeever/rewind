import {emitter} from '../events';
import {showTrackDetails, collectTracks, subscribeModal} from './commands';

test('弹层操作保留歌曲来源与原始字段，不流入应用通知，关闭订阅后不再接收', () => {
  const details: unknown[] = [];
  const collected: unknown[] = [];
  const notifications: unknown[] = [];
  const observe = (name: unknown) => notifications.push(name);
  emitter.on('*', observe);
  const detailSubscription = subscribeModal('DetailModal', (value) => details.push(value));
  const collectSubscription = subscribeModal('CollectModal', (value) => collected.push(value));
  const song = {id: 1, opaque: {value: false}};
  showTrackDetails({song, index: 2});
  collectTracks({api: 'qqMusic', data: [song]});
  expect(details).toEqual([{song, index: 2, api: 'netEase'}]);
  expect(collected).toEqual([{api: 'qqMusic', data: [song]}]);
  expect(notifications).toEqual([]);
  detailSubscription.remove();
  collectSubscription.remove();
  showTrackDetails({song, api: 'local'});
  collectTracks({api: 'netEase', song});
  expect(details).toHaveLength(1);
  expect(collected).toHaveLength(1);
  emitter.off('*', observe);
});
