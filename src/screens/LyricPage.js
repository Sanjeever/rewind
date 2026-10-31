import Text from './../components/Text';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import * as endpoints from '../services/endpoints';
import * as services from '../services/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
import LyricText from './lyrics/LyricText';
class LyricPage extends React.PureComponent {
  state = {
    img: null,
    songName: null,
    qrcode: null,
    trans: [],
    lyric: [],
  };
  songName = function (e) {
    const t = utils.parseArtist(e.singer);
    return `${e.song} · ${t}`;
  };
  getQRCode = (e, t) => {
    let r;
    switch (t) {
      case providers.netEase:
        r = `http://music.163.com/song?id=${e}`;
        break;
      case providers.qqMusic:
        r = `https://y.qq.com/n/yqq/song/${e}.html`;
    }
    this.setState({
      qrcode: `${endpoints.QRCODE_API}?text=${r}&size=128&margin=0`,
    });
  };
  getLyric = (e, t) => {
    switch (t) {
      case providers.netEase:
        services.Netease.lyric(e)
          .then((e) => {
            const lyric = utils.parseLyric(e.lrc.lyric);
            let trans = [];
            if (e.tlyric.lyric) {
              trans = utils.parseLyric(e.tlyric.lyric);
            }
            if (e.transUser) {
              lyric.push({
                txt: `翻译贡献者：${e.transUser.nickname}`,
              });
            }
            this.setState({
              lyric,
              trans,
            });
          })
          .catch(() => null);
        break;
      case providers.qqMusic:
        services.QQMusic.getLyric(e).then(({lyric, trans}) => {
          this.setState({
            lyric,
            trans,
          });
        });
    }
  };
  onClose = () => {
    this.props.navigation.goBack();
  };
  renderTxt = function (e) {
    return e
      .replace(/&apos;/gm, "'")
      .replace(/\/\//g, '')
      .replace(/&quot;/g, '"')
      .replace(/\[.+\]/gi, '');
  };
  getTrans = (e) => {
    const trans = this.state.trans;
    if (trans?.length > 0) {
      return trans.find((t) => e === t.total || Math.abs(e - t.total) < 1);
    }
    return null;
  };
  renderItem = ({item, index}) => {
    const a = this.getTrans(item.total);
    const hidden = item.hidden || false;
    return (
      <LyricText
        hidden={hidden}
        lyric={this.renderTxt(item.txt)}
        trans={a ? this.renderTxt(a.txt) : ''}
        onPress={() => {
          return this.onPress(index);
        }}
      />
    );
  };
  onPress = (e) => {
    const lyric = immer.produce(this.state.lyric, function (t) {
      t[e].hidden = !t[e].hidden || !t[e].hidden;
    });
    this.setState({
      lyric,
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const {id, api, item} = params;
      const a = trackInfo.extractFullInfo(item, 'big');
      this.setState({
        img: a.img,
        songName: this.songName(a),
      });
      this.getLyric(id, api);
      this.getQRCode(id, api);
      ReactNative.StatusBar.setHidden(true);
    }
  }
  componentWillUnmount() {
    ReactNative.StatusBar.setHidden(false);
  }
  render() {
    const e = this;
    const state = this.state;
    const {lyric, img, songName, qrcode} = state;
    return (
      <ReactNative.Modal animationType={'fade'} transparent={true} onRequestClose={this.onClose}>
        <ReactNative.View style={h.container}>
          <ReactNative.ScrollView>
            <ReactNative.View
              style={{
                height: constants.STATUS_BAR_HEIGHT,
              }}
            />
            <ReactNative.View style={h.cover}>
              {img ? (
                <ReactNative.Image
                  style={h.coverImg}
                  source={{
                    uri: img,
                  }}
                />
              ) : null}
              {qrcode ? (
                <ReactNative.Image
                  source={{
                    uri: qrcode,
                  }}
                  style={h.qrcode}
                />
              ) : null}
            </ReactNative.View>
            {lyric.map((item, index) =>
              e.renderItem({
                item,
                index,
              }),
            )}
            <ReactNative.View style={h.info}>
              <Text style={[h.text, h.songName]}>
                {'—— '}
                {songName}
              </Text>
            </ReactNative.View>
            <ReactNative.View
              style={{
                height: constants.STATUS_BAR_HEIGHT,
              }}
            />
          </ReactNative.ScrollView>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
var h = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontSize: 14,
  },
  cover: {
    marginVertical: 0.05 * constants.DEVICE_WIDTH,
    alignSelf: 'center',
    height: 0.9 * constants.DEVICE_WIDTH,
    width: 0.9 * constants.DEVICE_WIDTH,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  songName: {
    padding: 5,
    fontSize: 16,
  },
  info: {
    paddingVertical: 8,
    paddingHorizontal: 0.05 * constants.DEVICE_WIDTH,
  },
  qrcode: {
    width: 40,
    height: 40,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
});
export default LyricPage;
