import {emitter} from '../events/Emitter.js';

export function playTracks({song, tracks, index, api = 'netEase', ...options}) {
  emitter.emit('Player', {song, data: tracks, index, api, ...options});
}

export function insertTracks({tracks, api = 'netEase'}) {
  emitter.emit('InsertToList', {data: tracks, type: 'array', api});
}

export function clearQueue() {
  emitter.emit('Player', {type: 'clearPlayingList'});
}

export function subscribePlaybackCommands({play, insert, remove}) {
  const subscriptions = [
    emitter.addListener('Player', play),
    emitter.addListener('InsertToList', insert),
    emitter.addListener('DeleteFromQueue', remove),
  ];
  return () => subscriptions.forEach((subscription) => subscription.remove());
}
