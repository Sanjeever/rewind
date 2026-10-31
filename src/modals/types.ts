import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';

export interface TrackDetails {
  song: TrackFields;
  api: Provider;
  index?: number;
  playlistId?: TrackId | null;
  isCreatedByMe?: boolean;
}

export interface ModalEvents {
  LongPressModal: {item: TrackFields};
  DetailModal: TrackDetails;
  CollectModal: {api: Provider} & (
    {song: TrackFields; data?: never} | {song?: never; data: TrackFields[]}
  );
  SavePicModal: {img?: string; song?: string; type?: 'sponsor'};
  ChangePlaylist: undefined;
  NowPlayingModal: {forceClose: boolean};
}
