import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {PlaybackCommand, InsertCommand} from '../player/types';

export interface TrackDetails {
  song: TrackFields;
  api: Provider;
  index?: number;
  playlistId?: TrackId | null;
  isCreatedByMe?: boolean;
}
export interface AppEvents {
  Player: PlaybackCommand;
  InsertToList: InsertCommand;
  DeleteFromQueue: {item: TrackFields; api?: Provider};
  LongPressModal: {item: TrackFields};
  DetailModal: TrackDetails;
  CollectModal: {song?: TrackFields; data?: TrackFields[]; api: Provider};
  SavePicModal: {img?: string; song?: string; type?: 'sponsor'};
  PlayerClose: undefined;
  DeleteFromLocal: {deleteIndex: number};
  DeleteFromPlaylist: {api: Provider; trackid: TrackId} | undefined;
  ChangePlaylist: undefined;
  FM_MODE: undefined;
  UserLogined: undefined;
  SettingsChanged: undefined;
  BottomPaddingChange: number;
  AUDIO_NOISY: undefined;
  ChangeBackground: {path: string; opacity: number; blur: boolean};
  PlayerShow: boolean;
  CloseTimerEvent: number;
  PlaylistSetOrder: {api: Provider; index: number};
  SelectedUser: {userId: TrackId; nickname?: string; avatarUrl?: string};
  NowPlayingModal: {forceClose: boolean};
  SetHomeState: {autoSetPlaylistOrder: boolean};
  HidePlayer: {hide: boolean};
  LyricModal: undefined;
  CommentModal: undefined;
  AUDIO_FOCUS: {type: string};
  NOTIFICATION_ACTION_EVENT: {name: string};
}
