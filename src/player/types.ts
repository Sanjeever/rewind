import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
import type {Artist, TrackId} from '../services/track';
import type {StyleProp, ViewStyle, ImageStyle} from 'react-native';
import type {Settings} from '../settings/defaults';
import type {LyricRow} from '../utils/parseLyric';

export interface SongInfo {
  song?: string | null;
  singer?: Artist[] | string | null;
  uid?: TrackId;
}
export interface QueueSnapshot {
  tracks: readonly TrackFields[];
  songItem: TrackFields | null;
  playingIndex: number | null;
  api: Provider | null;
  songItemInfo: SongInfo;
}
export type QueueUpdate =
  Partial<QueueSnapshot> | ((current: QueueSnapshot) => Partial<QueueSnapshot>);
export function isActiveQueue<
  T extends Pick<QueueSnapshot, 'tracks' | 'songItem' | 'api' | 'playingIndex'>,
>(queue: T): queue is T & ActiveQueue {
  return queue.songItem !== null && queue.api !== null && queue.playingIndex !== null;
}
export interface PlayerProps extends QueueSnapshot {
  settings: Settings;
  bottomPaddingValue?: number;
  lyric: LyricRow[] | null;
  hasTrans: boolean;
  setLyric(lyric: LyricRow[] | null, hasTrans: boolean): void;
  setDisplayNowPlaying(show: boolean): void;
  setPlayerData(update: QueueUpdate, onCommitted?: (queue: QueueSnapshot) => void): void;
}
export interface PlayerState {
  url: string;
  playState: PlayState;
  currentTime: number;
  duration: number;
  expanded: boolean;
  playMode: PlayMode;
  showLyric: boolean;
  loaded: boolean;
  showTool: boolean;
  isLike: boolean;
  volume: number;
  color: string;
  showSlider: boolean;
  showTrans: boolean;
  showCoverElevation: boolean;
  randomArray: number[];
  isFM: boolean;
  lyricFontSize: number;
  retriedTimes: number;
  currentMiniLyric: string;
  pid?: TrackId;
  playingSongUID?: TrackId;
  lastPlayedTracksLoaded: boolean;
  isBackground: boolean;
  hidePlayer?: boolean;
  lrcText?: string;
  playerStyle?: StyleProp<ViewStyle>;
  imgStyle?: StyleProp<ImageStyle>;
}

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
