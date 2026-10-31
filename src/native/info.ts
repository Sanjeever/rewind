import {NativeModules} from 'react-native';
export const device = NativeModules.RewindDevice as {
  versionCode: number;
  versionName: string;
  isDebug: boolean;
  applicationId: string;
  language: string;
  setLanguageCode(code: string): Promise<'200'>;
  setOrientation(landscape: boolean): void;
  keepScreenOn(enabled: boolean): void;
  restart(): void;
  close(): void;
  showDevMenu(): void;
  setTimeout(id: number, milliseconds: number): void;
  clearTimeout(id: number): void;
};
const {versionCode, versionName, isDebug, applicationId} = device;
export {versionCode, versionName, isDebug, applicationId};
