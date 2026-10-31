import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {SearchEntity} from '../services/searchEntities';

export interface NeteaseAccount {
  userId?: TrackId;
  avatarUrl?: string;
  nickname?: string;
  signature?: string;
}
export interface QQAccount {
  userId?: TrackId;
  avatarUrl?: string;
  nickname?: string;
  cookies?: string;
}
export interface QQProfile {
  uin?: TrackId;
  headpic?: string;
  nick?: string;
  cookies?: string;
}
export interface Accounts {
  netEase?: NeteaseAccount;
  qqMusic?: QQAccount;
}
export interface Playlist extends SearchEntity {
  api?: Provider;
  dissid?: TrackId;
  dirid?: TrackId;
  title?: string;
  picurl?: string;
  songnum?: number;
  logo?: string;
  tracks?: TrackFields[];
}
export type ProviderPlaylists = Partial<Record<Provider, Playlist[]>>;
export interface PlaylistCache {
  id: TrackId;
  name: string;
  tracks: TrackFields[];
}
export interface CustomPlaylist {
  title: string;
  img?: string;
  tracks: TrackFields[];
}
export interface PlaylistDocument {
  playlists: CustomPlaylist[];
}
export interface SavedQueue {
  tracks: readonly TrackFields[];
  index: number;
  api: Provider;
}
export interface SearchHistoryEntry {
  text: string;
  api: Provider;
}
