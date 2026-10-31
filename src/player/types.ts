import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';

export type PlayMode = 'list' | 'random' | 'circulate';
export type PlayState = 'playing' | 'paused';
export interface QueueSelection {
  song: TrackFields;
  data: readonly TrackFields[];
  index: number;
  api: Provider;
  type?: 'insert' | 'ChangePlaylist';
  pid?: string | number;
  restore?: boolean;
}
export type PlaybackCommand = QueueSelection | {type: 'clearPlayingList'};
export type InsertCommand = {api: Provider} & (
  {type: 'item'; data: TrackFields} | {type: 'array'; data: readonly TrackFields[]}
);
export interface ActiveQueue {
  tracks: readonly TrackFields[];
  songItem: TrackFields;
  playingIndex: number;
  api: Provider;
}
export interface EmptyQueue {
  tracks: readonly TrackFields[];
  songItem: null;
  playingIndex: null;
  api: null;
}
export type QueueState = ActiveQueue | EmptyQueue;
