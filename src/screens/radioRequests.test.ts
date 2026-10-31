import {jest} from '@jest/globals';
const sublist = jest.fn<() => Promise<unknown>>();
const programs = jest.fn<() => Promise<unknown>>();
jest.unstable_mockModule('../services', () => ({
  Netease: {radio_sublist: sublist, radio_detail: programs},
}));
jest.unstable_mockModule('../services/index', () => ({
  Netease: {radio_sublist: sublist, radio_detail: programs},
}));
jest.unstable_mockModule('../components', () => ({
  PageContainer: undefined,
  ListItem: undefined,
  Spinkit: undefined,
}));
jest.unstable_mockModule('../components/Scrolling', () => ({SpringScrollView: undefined}));
jest.unstable_mockModule('../components/ParallaxList', () => ({default: undefined}));
jest.unstable_mockModule('../native/toast', () => ({toast() {}}));
jest.unstable_mockModule('../locales', () => ({default: {}}));
jest.unstable_mockModule('../theme/constants', () => ({STATUS_BAR_HEIGHT: 0}));
jest.unstable_mockModule('../events/index', () => ({}));
jest.unstable_mockModule('react-native', () => ({StyleSheet: {create: <T>(value: T) => value}}));
const {default: Radio} = await import('./Radio');
const {default: Detail} = await import('./RadioDetail');
test('订阅电台空结果结束加载，不误报未登录', async () => {
  const navigate = jest.fn();
  const page = new Radio({navigation: {navigate, goBack() {}}});
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  sublist.mockResolvedValue({code: 200, djRadios: []});
  await page.load(0);
  expect(page.state.loaded).toBe(true);
  expect(navigate).not.toHaveBeenCalled();
});
test('电台切换排序与卸载后，迟到的节目请求失效', async () => {
  const pending: ((value: unknown) => void)[] = [];
  programs.mockImplementation(
    () =>
      new Promise((resolve) => {
        pending.push(resolve);
      }),
  );
  const page = new Detail({
    route: {key: 'radio', name: 'RadioDetail', params: {item: {id: 1, name: '电台'}}},
    navigation: {goBack() {}},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  const first = page.getData(1, false);
  const second = page.getData(1, true);
  pending[1]({code: 200, programs: []});
  await second;
  pending[0]({code: 200, programs: [{id: 1, mainSong: {id: 2}}]});
  await first;
  expect(page.state.data).toEqual([]);
  expect(page.state.loaded).toBe(true);
  const more = page.getMore();
  page.componentWillUnmount();
  pending[2]({code: 200, programs: [{id: 3, mainSong: {id: 4}}]});
  await more;
  expect(page.state.data).toEqual([]);
});
