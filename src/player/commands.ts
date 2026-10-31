import {emitter} from '../events/Emitter';
import type {PlaybackCommand, QueueSelection, InsertCommand} from './types';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';

export type PlayTracks = Omit<QueueSelection, 'data' | 'api'> & {
  tracks: readonly TrackFields[];
  api?: Provider;
};

export function playTracks({song, tracks, index, api = 'netEase', ...options}: PlayTracks) {
  emitter.emit('Player', {song, data: tracks, index, api, ...options});
}

export function insertTracks({
  tracks,
  api = 'netEase',
}: {
  tracks: readonly TrackFields[];
  api?: Provider;
}) {
  emitter.emit('InsertToList', {data: tracks, type: 'array', api});
}

export function clearQueue() {
  emitter.emit('Player', {type: 'clearPlayingList'});
}

export function subscribePlaybackCommands({
  play,
  insert,
  remove,
}: {
  play(command: PlaybackCommand): void;
  insert(command: InsertCommand): void;
  remove(command: {item: TrackFields; api?: Provider}): void;
}) {
  const subscriptions = [
    emitter.addListener('Player', play),
    emitter.addListener('InsertToList', insert),
    emitter.addListener('DeleteFromQueue', remove),
  ];
  return () => subscriptions.forEach((subscription) => subscription.remove());
}
