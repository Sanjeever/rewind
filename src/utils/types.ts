export const isObject = function (n: unknown): n is object {
  return n === Object(n);
};
export const isString = function (n: unknown): n is string {
  return typeof n === 'string';
};
export const isArray = Array.isArray;
export const noop = function () {};
export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);
export const hasErrorCode = (error: unknown, code: string) =>
  error instanceof Error && 'code' in error && error.code === code;
export const isNumber = function (n: unknown): n is number {
  return typeof n === 'number' && n == n;
};
export const debounce = function <Args extends unknown[]>(
  n: (...args: Args) => void,
  e = 0,
  i = false,
) {
  let r: ReturnType<typeof setTimeout> | undefined;
  return function (...o: Args) {
    const c = () => {
      r = undefined;
      if (!i) {
        n(...o);
      }
    };
    const a = i && !r;
    clearTimeout(r);
    r = setTimeout(c, e);
    if (a) {
      n(...o);
    }
  };
};
