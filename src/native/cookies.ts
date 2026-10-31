import {NativeModules} from 'react-native';
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  secure?: boolean;
}
export default NativeModules.RewindCookies as {
  get(url: string): Promise<Record<string, Cookie>>;
  set(url: string, cookie: Cookie): Promise<true>;
  setFromResponse(url: string, header: string): Promise<true>;
};
