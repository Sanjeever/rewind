import {jest} from '@jest/globals';
jest.unstable_mockModule('../features/tracks/SongRow', () => ({default: undefined}));
const search = jest.fn<() => Promise<unknown>>();
const notices: unknown[] = [];
jest.unstable_mockModule('../services/index', () => ({
  QQMusic: {song_comments: search},
  Netease: undefined,
}));
jest.unstable_mockModule('../native/toast', () => ({
  toast: (value: unknown) => notices.push(value),
}));
jest.unstable_mockModule('../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../components/Scrolling', () => ({}));
jest.unstable_mockModule('../components/ParallaxList', () => ({default: undefined}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../utils/index', () => ({emojiStrip: (text: string) => text}));
const segment = jest.fn<(texts: string[]) => Promise<string[]>>();
jest.unstable_mockModule('../features/comments/commentSegmentation', () => ({
  default: {nlp: segment},
}));
jest.unstable_mockModule('../services/trackInfo', () => ({}));
jest.unstable_mockModule('../features/comments/CommentCard', () => ({default: undefined}));
jest.unstable_mockModule('../features/comments/CommentAnalysis', () => ({default: undefined}));
jest.unstable_mockModule('react-native', () => ({StyleSheet: {create: <T>(value: T) => value}}));
const {default: CommentPage} = await import('./CommentPage');
test('QQ 评论空结果结束加载，请求拒绝显示原因并结束加载', async () => {
  const page = new CommentPage({
    route: {key: 'comment', name: 'CommentPage', params: {song: {id: 1}, api: 'qqMusic'}},
    navigation: {goBack() {}, navigate() {}},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  search.mockResolvedValue({comment: {commentlist: [], commenttotal: 0}});
  await page.QQMusicCommnet(1);
  expect(page.state.loaded).toBe(true);
  expect(page.state.data).toEqual([]);
  search.mockRejectedValue(new Error('网络失败'));
  await page.QQMusicCommnet(1);
  expect(page.state.loaded).toBe(true);
  expect(notices).toEqual(['网络失败']);
});

test('分词保留评论与英文单词边界，重复点击不重复提交，卸载丢弃结果', async () => {
  const page = new CommentPage({
    route: {key: 'comment', name: 'CommentPage', params: {song: {id: 1}, api: 'qqMusic'}},
    navigation: {goBack() {}, navigate() {}},
  });
  const update = jest.fn();
  page.setState = update;
  let finish!: (words: string[]) => void;
  segment.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = page.getCommentKeywords([
    {rootcommentcontent: 'Hello world', nick: 'a', avatarurl: '', time: 0},
    {rootcommentcontent: '音乐很好听', nick: 'b', avatarurl: '', time: 0},
  ]);
  await page.getKeyWords(['重复点击']);
  expect(segment).toHaveBeenCalledTimes(1);
  expect(segment).toHaveBeenCalledWith(['Hello world', '音乐很好听']);
  page.componentWillUnmount();
  finish(['音乐']);
  await pending;
  expect(update).not.toHaveBeenCalled();
});
