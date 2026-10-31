import type {PlaybackCommand, InsertCommand} from './types';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';

export interface PlaybackEvents {
  Player: PlaybackCommand;
  InsertToList: InsertCommand;
  DeleteFromQueue: {item: TrackFields; api?: Provider};
  PlayerClose: undefined;
  FM_MODE: undefined;
  AUDIO_NOISY: undefined;
  CloseTimerEvent: number;
  HidePlayer: {hide: boolean};
}
