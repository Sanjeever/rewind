import LyricDataSource from './LyricDataSource';
test('歌词数据源保留构造输入、自定义键和修改通知', () => {
  const data = [{txt: '第一句'}];
  const source = new LyricDataSource(data, (item) => item.txt);
  expect(source.getKey(source.get(0), 0)).toBe('第一句');
  const events: string[] = [];
  const listener = {
    onPush: (item: {txt: string}) => {
      events.push(item.txt);
    },
  };
  source._addListener(listener);
  source.push({txt: '第二句'});
  source._removeListener(listener);
  source.push({txt: '第三句'});
  expect(events).toEqual(['第二句']);
  expect(data).toHaveLength(3);
  expect(new LyricDataSource().size()).toBe(0);
});
