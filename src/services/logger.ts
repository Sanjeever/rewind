export default function log(...values: unknown[]) {
  if (__DEV__) console.log(...values);
}
