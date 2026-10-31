import {NativeModules as _reactNative} from 'react-native';
const RNCrypto = _reactNative.RNCrypto;
const a = {
  weapi: function (e) {
    const t = JSON.stringify(e);
    return RNCrypto.weapi(t);
  },
  tencentSignature: function (e) {
    return RNCrypto.tencentSignature(e);
  },
};
export default a;
