import {emitter} from './Emitter';
import providers from '../services/providers';
import names from './names';
import {playTracks} from '../player/commands';

export {emitter};

export function toPlayer({item, data, index, api = providers.netEase, ...options}) {
  playTracks({song: item, tracks: data, index, api, ...options});
}

export function toInsertToList({data, api = providers.netEase, type = 'item', ...options}) {
  emitter.emit(names.InsertToList, {data, api, type, ...options});
}

export function toDetailModal({item, index, api = providers.netEase, ...options}) {
  emitter.emit(names.DetailModal, {song: item, index, api, ...options});
}

export function toLongPressModal({item}) {
  emitter.emit(names.LongPressModal, {item});
}
