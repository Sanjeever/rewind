import type {Provider} from '../services/providers';
import type {TrackId} from '../services/track';
export interface AppEvents {
  DeleteFromLocal: {deleteIndex: number};
  DeleteFromPlaylist: {api: Provider; trackid: TrackId} | undefined;
  UserLogined: undefined;
  SettingsChanged: undefined;
  BottomPaddingChange: number;
  ChangeBackground: {path: string; opacity: number; blur: boolean};
  PlayerShow: boolean;
  PlaylistSetOrder: {api: Provider; index: number};
  SelectedUser: {userId: TrackId; nickname?: string; avatarUrl?: string};
  SetHomeState: {autoSetPlaylistOrder: boolean};
}
