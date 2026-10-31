import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import zhCN from '../locales/zh_CN';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
const Host = ({children}: {children?: React.ReactNode}) =>
  React.createElement('View', {}, children);
const load = jest.fn<() => Promise<unknown>>();
const save = jest.fn<(value: {key: string; data: unknown}) => Promise<void>>();
jest.unstable_mockModule('../storage/index', () => ({storage: {load, save}}));
jest.unstable_mockModule('../native/toast', () => ({toast() {}}));
jest.unstable_mockModule('../native/restart', () => ({default: {restart() {}}}));
jest.unstable_mockModule('../locales/index', () => ({default: zhCN}));
jest.unstable_mockModule('../events/index', () => ({emitter: {emit() {}}}));
jest.unstable_mockModule('../components/Text', () => ({default: Host}));
jest.unstable_mockModule('../theme/constants', () => ({
  DEVICE_HEIGHT: 800,
  COLORS: {primary: '#fff', primaryAlpha70: '#aaa', primaryAlpha10: '#333'},
}));
jest.unstable_mockModule('../components/Slider', () => ({default: Host}));
jest.unstable_mockModule('../components/index', () => ({
  PageContainer: Host,
  Title: Host,
  SettingItem: Host,
  Icon: Host,
  Background: Host,
}));
jest.unstable_mockModule('../components/Scrolling', () => ({SpringScrollView: Host}));
jest.unstable_mockModule('../features/settings/NotificationOption', () => ({default: Host}));
jest.unstable_mockModule('react-native', () => ({
  StyleSheet: {create: <T,>(value: T) => value},
  View: Host,
  Modal: Host,
  TouchableOpacity: Host,
  TouchableNativeFeedback: Host,
  BackHandler: {addEventListener: () => ({remove() {}})},
}));
const {default: Settings} = await import('./Settings');
const {default: NotificationSettings} = await import('./MusicNotificationPage');
const {defaultSettings} = await import('../settings/defaults');
const {default: notification} = await import('../settings/notification');

test('设置滑块创建新配置，保存前不会修改原配置对象', async () => {
  load.mockResolvedValue(defaultSettings);
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Settings navigation={{goBack() {}}} />);
  });
  const page = tree.root.findByType(Settings).instance as InstanceType<typeof Settings>;
  const original = page.state.settings;
  const bottomPadding = Object.freeze(original.bottomPadding);
  await act(async () => page.onValueChange(24));
  expect(page.state.settings.bottomPadding.subtitle).toBe(24);
  expect(bottomPadding.subtitle).toBe(0);
  expect(page.state.settings).not.toBe(original);
  await act(async () => tree.unmount());
});

test('通知开关在 React 提交后持久化最新值', async () => {
  load.mockResolvedValue(notification.configObject);
  save.mockClear();
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<NotificationSettings navigation={{goBack() {}}} />);
  });
  const page = tree.root.findByType(NotificationSettings).instance as InstanceType<
    typeof NotificationSettings
  >;
  await act(async () => page.onSwitch('play'));
  expect(save).toHaveBeenLastCalledWith({key: 'musicNotification', data: page.state.config});
  expect(page.state.config.play.on).toBe(false);
  expect(notification.configObject.play.on).toBe(true);
  await act(async () => tree.unmount());
});
