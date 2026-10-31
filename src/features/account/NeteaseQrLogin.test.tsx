import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
const key = jest.fn<() => Promise<{code: number; unikey?: string}>>();
const check = jest.fn<() => Promise<{code: number}>>();
const account = jest.fn<() => Promise<{code: number; profile?: {userId: number}}>>();
jest.unstable_mockModule('../../services', () => ({
  Netease: {login_qr_key: key, login_qr_check: check, login_status: account},
}));
jest.unstable_mockModule('../../components/Text', () => ({
  default: ({children}: {children: React.ReactNode}) => React.createElement('Text', {}, children),
}));
jest.unstable_mockModule('../../components/TextButton', () => ({
  default: ({text, onPress}: {text: string; onPress(): void}) =>
    React.createElement('Button', {onPress}, text),
}));
jest.unstable_mockModule('react-native', () => ({
  View: ({children}: {children: React.ReactNode}) => React.createElement('View', {}, children),
  Modal: ({children}: {children: React.ReactNode}) => React.createElement('Modal', {}, children),
  Image: () => React.createElement('Image'),
}));
const {default: NeteaseQrLogin} = await import('./NeteaseQrLogin');
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  key.mockResolvedValue({code: 200, unikey: 'qr-key'});
});
afterEach(() => jest.useRealTimers());

test('二维码等待手机确认，授权后读取真实账号并停止轮询', async () => {
  check.mockResolvedValueOnce({code: 802}).mockResolvedValueOnce({code: 803});
  account.mockResolvedValue({code: 200, profile: {userId: 1}});
  const loggedIn = jest.fn<() => Promise<void>>().mockResolvedValue();
  let view!: renderer.ReactTestRenderer;
  await act(async () => {
    view = renderer.create(<NeteaseQrLogin onClose={() => {}} onLoggedIn={loggedIn} />);
  });
  await act(async () => {
    await jest.advanceTimersByTimeAsync(2000);
  });
  expect(view.root.findByType(NeteaseQrLogin).instance.state.status).toBe('请在手机上确认登录');
  await act(async () => {
    await jest.advanceTimersByTimeAsync(2000);
  });
  expect(loggedIn).toHaveBeenCalledWith({userId: 1});
  expect(jest.getTimerCount()).toBe(0);
  await act(async () => view.unmount());
});

test('二维码过期后停止请求，关闭页面丢弃迟到的 key', async () => {
  check.mockResolvedValue({code: 800});
  let view!: renderer.ReactTestRenderer;
  await act(async () => {
    view = renderer.create(<NeteaseQrLogin onClose={() => {}} onLoggedIn={async () => {}} />);
  });
  await act(async () => {
    await jest.advanceTimersByTimeAsync(2000);
  });
  expect(view.root.findByType(NeteaseQrLogin).instance.state.retry).toBe(true);
  expect(jest.getTimerCount()).toBe(0);
  await act(async () => view.unmount());
  let finish!: (value: {code: number; unikey: string}) => void;
  key.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await act(async () => {
    view = renderer.create(<NeteaseQrLogin onClose={() => {}} onLoggedIn={async () => {}} />);
  });
  await act(async () => view.unmount());
  await act(async () => finish({code: 200, unikey: 'late'}));
  const requests = check.mock.calls.length;
  await act(async () => {
    await jest.advanceTimersByTimeAsync(10000);
  });
  expect(check).toHaveBeenCalledTimes(requests);
  expect(jest.getTimerCount()).toBe(0);
});
