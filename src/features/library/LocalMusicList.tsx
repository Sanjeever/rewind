import SongRow from '../tracks/SongRow';
import * as React from 'react';
import * as reactNativeSpringScrollview from '../../components/Scrolling';
import * as components from '../../components/index';
import type {MediaTrack} from '../../native/mediaStore';
type Track = MediaTrack & {filename?: string; artist?: string};
interface Props {
  data?: Track[];
  nosinger?: boolean;
  playMusic(item: Track, index: number): void;
  addToQueue(item: Track): void;
  onDetail(item: Track, index: number): void;
}
class LocalMusicList extends React.Component<Props> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  formatAudioName = function (e: string) {
    return e.replace(/\.mp3/, '');
  };
  _renderItem = ({item, index}: {item: Track; index: number}) => {
    return (
      <SongRow
        key={index}
        song={this.formatAudioName((item.filename || item.title || item.album || item.artist)!)}
        singer={this.props.nosinger !== true ? item.singer || item.artist : undefined}
        onPress={() => {
          return this.props.playMusic(item, index);
        }}
        index={index}
        addToQueue={() => {
          return this.props.addToQueue(item);
        }}
        detail={() => {
          return this.props.onDetail(item, index);
        }}
      />
    );
  };
  render() {
    const data = this.props.data;
    if (data) {
      return (
        <reactNativeSpringScrollview.SpringScrollView
          ref={(r) => {
            this._scrollView = r;
          }}
        >
          {data.map((item, index) =>
            this._renderItem({
              item,
              index,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
      );
    }
    return <components.Spinkit />;
  }
}
export default LocalMusicList;
