import type {TrackFields} from '../services/track';
import {getTrackKey} from '../services/trackInfo';
import keys from '../storage/keys';
import {selectQueue, insertNext, removeFromQueue} from './queue';
import {isActiveQueue} from './types';
import type {
  QueueSnapshot,
  QueueSelection,
  PlayerProps,
  PlayerState,
  InsertCommand,
  PlayMode,
} from './types';
import {createPlayOrder, reconcilePlayOrder} from './playOrder';
import lyricPreferences from './lyricPreferences';

interface Host {
  getQueue(): QueueSnapshot;
  getState(): Pick<PlayerState, 'playMode' | 'randomArray'>;
  commit: PlayerProps['setPlayerData'];
  setOrder(order: number[]): void;
  setMode(mode: PlayMode, order: number[]): void;
  play(command: QueueSelection): void;
}

export default class PlaybackQueue {
  private keys: string[] = [];
  constructor(private readonly host: Host) {}

  reset() {
    this.keys = [];
  }

  sync(tracks: readonly TrackFields[], playNext: string[] = []) {
    const keys = tracks.map((song) => getTrackKey(song));
    if (
      playNext.length ||
      keys.length !== this.keys.length ||
      keys.some((key, index) => key !== this.keys[index])
    ) {
      const queue = this.host.getQueue();
      if (!isActiveQueue(queue)) throw new Error('播放队列尚未选中歌曲');
      const order = reconcilePlayOrder(
        this.keys,
        keys,
        this.host.getState().randomArray,
        getTrackKey(queue.songItem, queue.api),
        playNext,
      );
      this.host.setOrder(order);
      this.keys = keys;
    }
  }

  insert = ({data, type, api}: InsertCommand) => {
    const songs = type === 'array' ? data : [data];
    if (!songs.length) return;
    if (!this.host.getQueue().tracks.length) {
      this.host.play({song: songs[0], data: songs, index: 0, api});
      return;
    }
    this.host.commit(
      (current) => {
        const next = isActiveQueue(current)
          ? insertNext(current, songs, api)
          : selectQueue(
              current,
              {song: songs[0], data: songs, index: 0, api},
              this.host.getState().playMode,
            );
        return {tracks: next.tracks, playingIndex: next.playingIndex};
      },
      (selected) =>
        this.sync(
          selected.tracks,
          songs.map((song) => getTrackKey(song, api)),
        ),
    );
  };

  remove = ({item}: {item: TrackFields}) => {
    this.host.commit(
      (current) => {
        if (!isActiveQueue(current)) return {};
        const next = removeFromQueue(current, item);
        return {tracks: next.tracks, playingIndex: next.playingIndex};
      },
      (selected) => this.sync(selected.tracks),
    );
  };

  changeMode = () => {
    const state = this.host.getState();
    const mode = ({circulate: 'list', list: 'random', random: 'circulate'} as const)[
      state.playMode
    ];
    this.host.setMode(
      mode,
      mode === 'random' ? createPlayOrder(this.host.getQueue().tracks.length) : state.randomArray,
    );
    lyricPreferences.save(keys.lastPlayMode, mode);
  };
}
