import {NativeModules} from 'react-native';
const native = NativeModules.RNCrypto as {
  weapi(data: string): Promise<{params: string; encSecKey: string}>;
  tencentSignature(data: string): Promise<never>;
};
export default {
  weapi(data: Record<string, unknown>) {
    return native.weapi(JSON.stringify(data));
  },
  tencentSignature(data: string) {
    return native.tencentSignature(data);
  },
};
