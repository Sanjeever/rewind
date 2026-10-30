export default function log(...values) {
  if (__DEV__) console.log(...values);
}
