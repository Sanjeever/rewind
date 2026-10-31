import {NativeModules} from 'react-native';
const native = NativeModules.RNCrypto as {
  weapi(data: string): Promise<{params: string; encSecKey: string}>;
  eapi(path: string, data: string): Promise<string>;
  decodeBase64(values: string[]): Promise<string[]>;
};
export default {
  weapi(data: Record<string, unknown>) {
    return native.weapi(JSON.stringify(data));
  },
  eapi(path: string, data: Record<string, unknown>) {
    return native.eapi(path, JSON.stringify(data));
  },
  decodeBase64(values: string[]) {
    return native.decodeBase64(values);
  },
};
