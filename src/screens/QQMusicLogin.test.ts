import {jest} from '@jest/globals';
import type {Accounts, QQProfile} from '../storage/models';
import type QQMusicService from '../services/qqmusic';
const profile =
  jest.fn<
    (
      ...args: Parameters<typeof QQMusicService.profile>
    ) => NonNullable<ReturnType<typeof QQMusicService.profile>>
  >();
const account = jest.fn<() => Promise<Accounts | null>>();
const save = jest.fn<(info: QQProfile, api: string) => Promise<void>>();
const emit = jest.fn();
const notice = jest.fn();
jest.unstable_mockModule('../services/index', () => ({
  QQMusic: {profile, disslist: async () => [{songlist: []}]},
}));
jest.unstable_mockModule('../services/qqmusic/session', () => ({
  getWebSession: async () => ({musicKey: 'key', musicId: '123', cookies: 'session=current'}),
  parseSession: jest.fn(),
}));
jest.unstable_mockModule('../storage/users', () => ({
  default: {
    getUserInfo: account,
    saveUserStorage: save,
    saveUserPlayList: async () => {},
    saveUserLikeList: async () => {},
  },
}));
jest.unstable_mockModule('../events/index', () => ({emitter: {emit}}));
jest.unstable_mockModule('../native/toast', () => ({toast: notice}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../components/Scrolling', () => ({}));
jest.unstable_mockModule('../locales/index', () => ({
  default: {PLAYLIST_FETCH_FAILED: '歌单获取失败'},
}));
jest.unstable_mockModule('react-native', () => ({}));
jest.unstable_mockModule('../features/account/LoginView', () => ({default: undefined}));
jest.unstable_mockModule('../features/account/QQMusicHelp', () => ({default: undefined}));
jest.unstable_mockModule('react-native-webview', () => ({WebView: undefined}));
const {default: QQMusicLogin} = await import('./QQMusicLogin');
function page() {
  const view = new QQMusicLogin({} as ConstructorParameters<typeof QQMusicLogin>[0]);
  view.setState = (update) => {
    view.state = {
      ...view.state,
      ...(typeof update === 'function' ? update(view.state, view.props) : update),
    };
  };
  return view;
}
beforeEach(() => {
  jest.clearAllMocks();
  profile.mockResolvedValue({
    creator: {uin: '123', headpic: 'https://avatar.example/123', nick: '昵称'},
    mymusic: [{id: 1, title: '喜欢'}],
    mydiss: {list: []},
  });
});

test('网页资料尚未加载时，授权后用账号接口补全头像与昵称并保留会话', async () => {
  const view = page();
  await view.onQQMusicMessage({nickname: '', avatarUrl: '', cookies: ''});
  expect(profile).toHaveBeenCalledWith('123', 'session=current');
  expect(save).toHaveBeenLastCalledWith(
    {
      uin: '123',
      headpic: 'https://avatar.example/123',
      nick: '昵称',
      cookies: 'session=current',
    },
    'qqMusic',
  );
  expect(view.state).toMatchObject({
    avatar: 'https://avatar.example/123',
    nickname: '昵称',
    showWebView: false,
  });
  expect(notice).not.toHaveBeenCalled();
});

test('打开已有缺失头像的账号时补全资料，保留原账号和 Cookie', async () => {
  account.mockResolvedValue({
    qqMusic: {userId: '123', avatarUrl: '', nickname: '123', cookies: 'session=current'},
  });
  const view = page();
  await view.loadInfo();
  expect(view.state).toMatchObject({avatar: 'https://avatar.example/123', nickname: '昵称'});
  expect(save).toHaveBeenLastCalledWith(
    expect.objectContaining({uin: '123', cookies: 'session=current'}),
    'qqMusic',
  );
  expect(emit).toHaveBeenCalled();
});

test('完整账号读取本地资料，无需重新请求；资料请求失败保留已有授权并显示原因', async () => {
  account.mockResolvedValue({
    qqMusic: {
      userId: '123',
      avatarUrl: 'https://avatar',
      nickname: '昵称',
      cookies: 'session=current',
    },
  });
  await page().loadInfo();
  expect(profile).not.toHaveBeenCalled();
  profile.mockRejectedValue(new Error('资料请求失败'));
  const view = page();
  await view.onQQMusicMessage({nickname: '', avatarUrl: '', cookies: ''});
  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({uin: '123', cookies: 'session=current'}),
    'qqMusic',
  );
  expect(notice).toHaveBeenCalledWith('资料请求失败');
});
