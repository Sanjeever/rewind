import {getTrackKey} from '../services/trackFields.js';

function tagTrack(song, api) {
  return {...song, api: song.api || api};
}

export function selectQueue(current, command, playMode) {
  let tracks = command.data.map(song => tagTrack(song, command.api));
  let index = command.type === 'ChangePlaylist' && playMode !== 'random' ? 0 : command.index;
  let song = index === 0 && command.type === 'ChangePlaylist' ? tracks[0] : tagTrack(command.song, command.api);
  if (song.mainTrackId > 0) song = {...song, rid: song.id, id: song.mainTrackId};
  if (command.type === 'insert' && current.tracks.length) {
    const key = getTrackKey(song);
    tracks = current.tracks.map(track => tagTrack(track, current.api)).filter(track => getTrackKey(track) !== key);
    tracks.unshift(song);
    index = 0;
  } else {
    tracks[index] = song;
  }
  return {tracks, songItem: song, playingIndex: index, api: song.api};
}

export function insertNext(current, songs, api) {
  const additions = songs.map(song => tagTrack(song, api));
  const currentKey = getTrackKey(current.songItem, current.api);
  const keys = new Set(additions.map(song => getTrackKey(song)));
  keys.delete(currentKey);
  const unique = additions.filter(song => keys.delete(getTrackKey(song)));
  const insertedKeys = new Set(unique.map(song => getTrackKey(song)));
  const tracks = current.tracks.map(song => tagTrack(song, current.api))
    .filter(song => !insertedKeys.has(getTrackKey(song)));
  const playingIndex = tracks.findIndex(song => getTrackKey(song) === currentKey);
  tracks.splice(playingIndex + 1, 0, ...unique);
  return {...current, tracks, playingIndex};
}

export function removeFromQueue(current, song, api = current.api) {
  const key = getTrackKey(song, api);
  const currentKey = getTrackKey(current.songItem, current.api);
  const tracks = current.tracks.filter(track => getTrackKey(track, current.api) !== key);
  return {...current, tracks, playingIndex: tracks.findIndex(track => getTrackKey(track, current.api) === currentKey)};
}
