import {jest} from '@jest/globals';
const save = jest.fn<() => Promise<void>>();
const restart = jest.fn();
jest.unstable_mockModule('../storage', () => ({storage: {save}}));
jest.unstable_mockModule('../native/restart', () => ({default: {restart}}));
jest.unstable_mockModule('../native/toast', () => ({toast: jest.fn()}));
jest.unstable_mockModule('react-native', () => ({
  StyleSheet: {create: <T>(value: T) => value},
  Alert: undefined,
  BackHandler: undefined,
  View: undefined,
}));
jest.unstable_mockModule('../components', () => ({PageContainer: undefined, Icon: undefined}));
jest.unstable_mockModule('../components/Scrolling', () => ({SpringScrollView: undefined}));
jest.unstable_mockModule('../native/TabbedViewPager', () => ({default: undefined}));
jest.unstable_mockModule('../features/settings/ProviderSelector', () => ({default: undefined}));
jest.unstable_mockModule('../settings/pages', () => ({
  default: {
    pages: [
      {title: '一', page: 'one', icon: {name: 'one'}},
      {title: '二', page: 'two', icon: {name: 'two'}},
    ],
    apis: ['custom', 'netEase', 'qqMusic'],
  },
}));
jest.unstable_mockModule('../locales', () => ({default: {}}));
const {default: OrderPage} = await import('./OrderPage');
test('排序按钮保持数组内容，保存完成后才重启，保存失败不重启', async () => {
  const page = new OrderPage({navigation: {goBack() {}}});
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  page.move('pages', 0, 1);
  page.move('apis', 2, -1);
  expect(page.state.pages.map((item) => item.page)).toEqual(['two', 'one']);
  expect(page.state.apis).toEqual(['custom', 'qqMusic', 'netEase']);
  const completions: (() => void)[] = [];
  save.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        completions.push(resolve);
      }),
  );
  const pending = page.confirmChange();
  expect(restart).not.toHaveBeenCalled();
  completions[0]();
  await Promise.resolve();
  expect(restart).not.toHaveBeenCalled();
  completions[1]();
  await pending;
  expect(restart).toHaveBeenCalledTimes(1);
  save.mockRejectedValue(new Error('写入失败'));
  await page.confirmChange();
  expect(restart).toHaveBeenCalledTimes(1);
});
