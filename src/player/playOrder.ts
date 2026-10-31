import type {PlayMode} from './types';
type Direction = 'pre' | 'next';
const wrap = (index: number, length: number) => (length ? (index + length) % length : -1);

export function getNextPlayIndex({
  type,
  tracks,
  playingIndex,
}: {
  type: Direction;
  tracks: readonly unknown[];
  playingIndex: number;
}) {
  return wrap(playingIndex + (type === 'next' ? 1 : -1), tracks.length);
}

export function getRandomIndex({
  type,
  randomArray,
  playingIndex,
}: {
  type: Direction;
  randomArray: readonly number[];
  playingIndex: number;
}) {
  const position = randomArray.indexOf(playingIndex);
  return randomArray[wrap(position + (type === 'pre' ? -1 : 1), randomArray.length)] ?? -1;
}

export function createPlayOrder(length: number, random = Math.random) {
  const order = Array.from({length}, (_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [order[index], order[target]] = [order[target], order[index]];
  }
  return order;
}

export function reconcilePlayOrder(
  previousKeys: readonly string[],
  keys: readonly string[],
  order: readonly number[],
  currentKey: string | undefined,
  nextKeys: readonly string[] = [],
) {
  const indices = new Map(keys.map((key, index) => [key, index]));
  const next = [...new Set(nextKeys)].filter((key) => key !== currentKey && indices.has(key));
  const nextSet = new Set(next);
  const retained = order
    .map((index) => previousKeys[index])
    .filter((key) => indices.has(key) && !nextSet.has(key));
  const known = new Set([...retained, ...next]);
  const added = keys.filter((key) => !known.has(key));
  retained.push(...createPlayOrder(added.length).map((index) => added[index]));
  retained.splice((currentKey === undefined ? -1 : retained.indexOf(currentKey)) + 1, 0, ...next);
  return retained.map((key) => indices.get(key)!);
}

export function getNextPlayIndexByPagerPos({
  pos,
  playMode,
  randomArray,
  playingIndex,
  len,
}: {
  pos: number;
  playMode: PlayMode;
  randomArray: readonly number[];
  playingIndex: number;
  len: number;
}) {
  if (pos === 1) return playingIndex;
  const type = pos === 0 ? 'pre' : 'next';
  if (playMode === 'random') return getRandomIndex({type, randomArray, playingIndex});
  return wrap(playingIndex + (type === 'pre' ? -1 : 1), len);
}
