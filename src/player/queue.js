import names from '../events/names';
import {extractFullInfo} from '../services/trackInfo';

export default class QueueSelection {
  constructor(props, playMode) {
    this.props = props;
    this.playMode = playMode;
  }
  data(event, tracks, song) {
    if (event.type !== 'insert' || !this.props.tracks.length) return tracks;
    const queue = this.props.tracks.filter(item => extractFullInfo(item).song !== extractFullInfo(song).song);
    if (event.api !== this.props.api) for (const item of queue) if (!item.api) item.api = this.props.api;
    queue.unshift(song);
    return queue;
  }
  index(event) {
    if (event.type === names.ChangePlaylist && this.playMode !== 'random') return 0;
    if (event.type === 'insert' && this.props.tracks.length) return 0;
    return event.index;
  }
  songItem(event, tracks) {
    let song = event.song;
    if (song?.mainTrackId > 0) { song.rid = song.id; song.id = song.mainTrackId; }
    if (event.type === names.ChangePlaylist && this.playMode !== 'random') song = tracks[0];
    if (event.api !== this.props.api) song.api = event.api;
    return song;
  }
  api(event) {
    return event.song?.api && event.song.api !== event.api ? event.song.api : event.api;
  }
}
