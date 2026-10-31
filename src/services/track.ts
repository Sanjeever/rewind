import type {Provider} from './providers';

export type TrackId = number | string;
export type ArtworkSize = 'small' | 'big';
export interface Artist {
  id?: TrackId;
  mid?: string;
  name: string;
  alias?: string[];
}
export interface Album {
  id?: TrackId;
  mid?: string;
  name?: string;
  picUrl?: string;
}

// 旧队列、媒体扫描和两种在线接口使用不同字段；读取时保留原始结构。
export interface TrackFields {
  api?: Provider;
  id?: TrackId;
  mid?: string;
  songmid?: string;
  songid?: TrackId;
  name?: string;
  songname?: string;
  song?: string;
  title?: string;
  filename?: string;
  singer?: Artist[] | string;
  artists?: Artist[];
  ar?: Artist[];
  album?: Album | string;
  al?: Album | Album[];
  albumname?: string;
  albummid?: string;
  qqAlbumId?: string;
  localAlbumId?: TrackId;
  albumId?: TrackId;
  localPath?: string;
  tns?: string[];
  alias?: string[];
  transName?: string;
  coverUrl?: string;
  img?: string;
  path?: string;
  dt?: number;
  duration?: number;
  interval?: number;
  mainTrackId?: number;
  rid?: TrackId;
  fee?: number;
  description?: string;
  mv?: number | {vid?: TrackId};
  vid?: TrackId;
  transNames?: string[];
  mvid?: TrackId;
  isFM?: boolean;
  lastRank?: number;
  playCount?: number;
}

export interface NeteaseTrack extends TrackFields {
  api?: 'netEase';
  id: TrackId;
  album?: Album;
  singer?: Artist[];
}
export interface QQTrack extends TrackFields {
  api?: 'qqMusic';
  singer?: Artist[];
  album?: Album;
}
export interface LocalTrack extends TrackFields {
  api?: 'local';
  path: string;
  singer?: string;
  album?: string;
}
export type Track = NeteaseTrack | QQTrack | LocalTrack;

export interface DisplayTrack<T extends TrackFields = TrackFields> {
  key: string;
  api: Provider;
  title: string | undefined;
  artists: string[];
  album: string;
  artwork: string;
  /** 毫秒，未知时保留 null。 */
  duration: number | null;
  source: T;
}
