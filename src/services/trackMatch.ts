import {getSinger, getSong} from './trackFields';
import type {TrackFields} from './track';

const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/\s+/g, '');
const artists = (song: TrackFields) => {
  const value = getSinger(song);
  return typeof value === 'string'
    ? [normalize(value)]
    : (value?.flatMap((artist) =>
        typeof artist.name === 'string' ? [normalize(artist.name)] : [],
      ) ?? []);
};
const duration = (song: TrackFields) =>
  song.dt ?? song.duration ?? (song.interval == null ? undefined : song.interval * 1000);

export function findMatchingTrack<T extends TrackFields>(source: TrackFields, candidates: T[]) {
  const name = getSong(source);
  const singers = artists(source);
  if (!name || !singers.length) return undefined;
  const milliseconds = duration(source);
  return candidates.find((song) => {
    if (normalize(getSong(song) ?? '') !== normalize(name)) return false;
    const names = artists(song);
    if (!singers.every((singer) => names.includes(singer))) return false;
    const other = duration(song);
    return milliseconds == null || other == null || Math.abs(milliseconds - other) <= 2000;
  });
}
