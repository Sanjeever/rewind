import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {SearchEntity} from '../services/searchEntities';
import type {CustomPlaylist, Playlist, NeteaseAccount} from '../storage/models';

export interface UserProfile extends NeteaseAccount {
  userId: TrackId;
  birthday?: number;
  followed?: boolean;
  backgroundUrl?: string;
  follows?: number;
  followeds?: number;
  gender?: number;
  city?: number;
  province?: number;
  playlistCount?: number;
  eventCount?: number;
  description?: string;
  userType?: number;
}
export interface PlaylistParams {
  playlist: Playlist;
  api: Provider;
  index?: number;
  subscribed?: boolean;
  isTopList?: boolean;
  isCreatedByMe?: boolean;
  userId?: TrackId;
}
export type AppRoutes = {
  Home: undefined;
  Skin: undefined;
  About: undefined;
  SearchPage: {text?: string} | undefined;
  Settings: undefined;
  MusicHistory: undefined;
  CustomPlaylist: {playlist: CustomPlaylist; index: number};
  NeteaseLogin: undefined;
  QQMusicLogin: undefined;
  InitialLogin: undefined;
  Playlist: PlaylistParams;
  LocalMusic: undefined;
  ArtistPage: {item: SearchEntity & {is_follow?: number}; api: Provider};
  AlbumPage: {item: SearchEntity; api: Provider};
  Msg: undefined;
  MsgHistory: {item: {fromUser: UserProfile}};
  MusicRecommend: undefined;
  Radio: undefined;
  RadioDetail: {item: {id: TrackId; name?: string}};
  Charts: undefined;
  HotPlaylist: undefined;
  Favs: undefined;
  CachePage: undefined;
  WebViewPage: {url: string};
  Tip: {url?: string} | undefined;
  Cloud: undefined;
  UserManager: undefined;
  UserInfo: {userId: TrackId};
  FollowPage: {profile: UserProfile};
  LanguagePage: undefined;
  FeaturePage: undefined;
  OrderPage: undefined;
  MusicNotificationPage: undefined;
  CommentPage: {song: TrackFields; api: Provider};
  ListenRecord: {profile: UserProfile};
  PlaylistIntersection: {item?: Playlist} | undefined;
  LyricPage: {id: TrackId; api: Provider; item: TrackFields};
  HappyBirthday: {profile: UserProfile & {birthday: number}};
  SubNewSongs: undefined;
  Video: {mvid: TrackId; api: Provider};
};
export type ScreenProps<K extends keyof AppRoutes> = NativeStackScreenProps<AppRoutes, K>;
export interface Navigation {
  goBack(): void;
  navigate(...args: NavigateArgs): void;
}
export type SimpleRoute = {
  [K in keyof AppRoutes]: undefined extends AppRoutes[K] ? K : never;
}[keyof AppRoutes];
export type NavigateArgs = {
  [K in keyof AppRoutes]: undefined extends AppRoutes[K]
    ? [name: K, params?: AppRoutes[K]]
    : [name: K, params: AppRoutes[K]];
}[keyof AppRoutes];
