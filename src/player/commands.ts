import createEmitter from '../events/Emitter';
import type {PlaybackEvents} from './commandTypes';
import type {PlaybackCommand, QueueSelection, InsertCommand} from './types';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';

const commands = createEmitter<PlaybackEvents>();

export function subscribePlaybackEvent<K extends keyof PlaybackEvents>(
  name: K,
  listener: (payload: PlaybackEvents[K]) => void,
) {
  return commands.addListener(name, listener);
}

export type PlayTracks = Omit<QueueSelection, 'data' | 'api'> & {
  tracks: readonly TrackFields[];
  api?: Provider;
};

export function playTracks({song, tracks, index, api = 'netEase', ...options}: PlayTracks) {
  commands.emit('Player', {song, data: tracks, index, api, ...options});
}

export function insertTracks({
  tracks,
  api = 'netEase',
}: {
  tracks: readonly TrackFields[];
  api?: Provider;
}) {
  commands.emit('InsertToList', {data: tracks, type: 'array', api});
}

export function clearQueue() {
  commands.emit('Player', {type: 'clearPlayingList'});
}

export function removeFromPlaybackQueue(selection: PlaybackEvents['DeleteFromQueue']) {
  commands.emit('DeleteFromQueue', selection);
}

export function pausePlayback() {
  commands.emit('AUDIO_NOISY');
}

export function closePlayer() {
  commands.emit('PlayerClose');
}

export function togglePersonalRadio() {
  commands.emit('FM_MODE');
}

export function schedulePlaybackStop(minutes: number) {
  commands.emit('CloseTimerEvent', minutes);
}

export function setPlayerHidden({hide}: PlaybackEvents['HidePlayer']) {
  commands.emit('HidePlayer', {hide});
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
    commands.addListener('Player', play),
    commands.addListener('InsertToList', insert),
    commands.addListener('DeleteFromQueue', remove),
  ];
  return () => subscriptions.forEach((subscription) => subscription.remove());
}
