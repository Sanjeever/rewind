import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
class LocalMusicList extends React.Component {
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  formatAudioName = function (e) {
    return e.replace(/\.mp3/, '');
  };
  _renderItem = ({item, index}) => {
    return (
      <components.SongRow
        key={index}
        song={this.formatAudioName(item.filename || item.title || item.album || item.artist)}
        singer={this.props.nosinger !== true && (item.singer || item.artist)}
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
            return (this._scrollView = r);
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
