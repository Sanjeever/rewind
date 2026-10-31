export const isObject = function (n) {
  return n === Object(n);
};
export const isString = function (n) {
  return typeof n === 'string';
};
export const isArray = Array.isArray;
export const noop = function () {};
export const isNumber = function (n) {
  return typeof n === 'number' && n == n;
};
export const debounce = function (n, e = 0) {
  let r;
  const i = arguments.length > 2 && arguments[2] !== undefined && arguments[2];
  return function (...o) {
    const c = () => {
      r = null;
      if (!i) {
        n(...o);
      }
    };
    const a = i && !r;
    clearTimeout(r);
    r = setTimeout(() => c(...o), e);
    if (a) {
      n(...o);
    }
  };
};
