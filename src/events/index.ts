import {emitter} from './Emitter';
import providers from '../services/providers';
import names from './names';
import {playTracks} from '../player/commands';
import type {PlayTracks} from '../player/commands';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
import type {TrackDetails} from './types';

export {emitter};

export function toPlayer({
  item,
  data,
  index,
  api = providers.netEase,
  ...options
}: Omit<PlayTracks, 'song' | 'tracks'> & {item: TrackFields; data: readonly TrackFields[]}) {
  playTracks({song: item, tracks: data, index, api, ...options});
}

export function toInsertToList(
  options: {api?: Provider} & (
    {data: TrackFields; type?: 'item'} | {data: readonly TrackFields[]; type: 'array'}
  ),
) {
  const api = options.api ?? providers.netEase;
  if (options.type === 'array') emitter.emit(names.InsertToList, {...options, api});
  else emitter.emit(names.InsertToList, {...options, api, type: 'item'});
}

export function toDetailModal({
  item,
  index,
  api = providers.netEase,
  ...options
}: Omit<TrackDetails, 'song' | 'api'> & {item: TrackFields; api?: Provider}) {
  emitter.emit(names.DetailModal, {song: item, index, api, ...options});
}

export function toLongPressModal({item}: {item: TrackFields}) {
  emitter.emit(names.LongPressModal, {item});
}
