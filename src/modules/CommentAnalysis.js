import Pager from './../components/Pager.js';
import _default2 from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import * as utils from '../utils/index';
import CommentBubble from './CommentBubble.js';
class CommentAnalysis extends React.Component {
  hash = {};
  state = {
    selectedComments: [],
    showSelectedComments: false,
    selectedIndex: 0,
  };
  filterHot = function (e, t) {
    const n = e.content || e.rootcommentcontent;
    return !!n && n.replace(/\s/gi, '').includes(t);
  };
  showHotComment = (e, selectedIndex) => {
    const selectedComments = this.props.hotComments.filter((t) => this.filterHot(t, e));
    this.setState({
      selectedComments,
      showSelectedComments: true,
      selectedIndex,
    });
  };
  getIndex = function (e, t, n) {
    let l = e;
    if (n === 'next') {
      l = e + 1 >= t ? 0 : e + 1;
    } else if (n === 'pre') {
      l = e < 1 ? t - 1 : e - 1;
    }
    return l;
  };
  selectItem = (e = 'next') => {
    const wordscloud = this.props.wordscloud;
    const selectedIndex = this.state.selectedIndex;
    const r = this.getIndex(selectedIndex, wordscloud.length, e);
    this.showHotComment(wordscloud[r], r);
  };
  getSelectedText = (e = 'mid') => {
    const wordscloud = this.props.wordscloud;
    const selectedIndex = this.state.selectedIndex;
    return wordscloud[this.getIndex(selectedIndex, wordscloud.length, e)];
  };
  useRandomValues = (e) => {
    if (!this.hash[e]) {
      const t = Math.random();
      this.hash[e] = {
        randomSize: utils.random.getInt(15, 30),
        textOpacity: t >= 0.8 ? 0.8 : t + 0.2,
      };
    }
    return {
      randomSize: this.hash[e].randomSize,
      textOpacity: this.hash[e].textOpacity,
    };
  };
  renderSelectedItem = () => {
    return (
      <ReactNative.View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReactNative.View
          style={{
            height: 80,
            justifyContent: 'center',
          }}
        >
          <Pager
            style={{
              width: constants.DEVICE_WIDTH,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            initialPage={1}
            onPageSelected={this.onTitleSelected}
            ref={(instance) => (this.titlePager = instance)}
          >
            {React.createElement(f, {
              text: this.getSelectedText('pre'),
            })}
            {React.createElement(f, {
              text: this.getSelectedText('mid'),
            })}
            {React.createElement(f, {
              text: this.getSelectedText('next'),
            })}
          </Pager>
        </ReactNative.View>
        {this.renderCommentItems()}
      </ReactNative.View>
    );
  };
  renderCommentItems = () => {
    const selectedComments = this.state.selectedComments;
    if (selectedComments && !(selectedComments.length < 1)) {
      if (selectedComments.length > 1) {
        return selectedComments.map((e, key) => (
          <ReactNative.View
            key={key}
            style={{
              marginTop: 30,
            }}
          >
            <CommentBubble item={e} title={this.getSelectedText('mid')} />
            {e.beReplied.length > 0 ? <CommentBubble item={e.beReplied[0]} replied={true} /> : null}
          </ReactNative.View>
        ));
      }
      const n = selectedComments[0];
      return (
        <ReactNative.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommentBubble item={n} title={this.getSelectedText('mid')} />
          {n.beReplied?.length > 0 ? <CommentBubble item={n.beReplied[0]} replied={true} /> : null}
        </ReactNative.View>
      );
    }
  };
  closeItem = () => {
    this.setState({
      showSelectedComments: false,
    });
  };
  onTitleSelected = (e) => {
    switch (e.nativeEvent.position) {
      case 0:
        this.selectItem('pre');
        break;
      case 2:
        this.selectItem('next');
    }
    this.titlePager?.setPageWithoutAnimation(1);
  };
  render() {
    const e = this;
    const props = this.props;
    const {wordscloud, loadWordsCloudDone, song} = props;
    if (loadWordsCloudDone) {
      return (
        <ReactNative.View
          style={{
            flex: 1,
          }}
        >
          <reactNativeSpringScrollview.SpringScrollView
            contentStyle={{
              paddingTop: '15%',
            }}
          >
            <ReactNative.View
              style={{
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              {React.createElement(
                _default2,
                {
                  style: [
                    p.text,
                    {
                      fontSize: 25,
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontWeight: 'bold',
                    },
                  ],
                },
                song.song,
              )}
              {React.createElement(
                _default2,
                {
                  style: [
                    p.text,
                    {
                      fontSize: 15,
                      alignSelf: 'center',
                    },
                  ],
                },
                utils.parseArtist(song.singer),
              )}
            </ReactNative.View>
            <ReactNative.View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 20,
              }}
            >
              {wordscloud?.map(function (t, n) {
                const l = e.useRandomValues(n);
                const {textOpacity, randomSize} = l;
                return (
                  <ReactNative.View
                    key={n}
                    style={[
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <ReactNative.TouchableOpacity
                      onPress={function () {
                        return e.showHotComment(t, n);
                      }}
                    >
                      {React.createElement(
                        _default2,
                        {
                          style: [
                            p.text,
                            {
                              margin: 1,
                              opacity: textOpacity,
                              textAlignVertical: 'center',
                              fontSize: randomSize,
                            },
                          ],
                        },
                        t,
                      )}
                    </ReactNative.TouchableOpacity>
                  </ReactNative.View>
                );
              })}
            </ReactNative.View>
          </reactNativeSpringScrollview.SpringScrollView>
          <ReactNative.Modal
            visible={this.state.showSelectedComments}
            onRequestClose={this.closeItem}
            animationType={'fade'}
            transparent={true}
          >
            <ReactNative.View
              style={{
                flex: 1,
                backgroundColor: '#100f14',
              }}
            >
              <reactNativeSpringScrollview.SpringScrollView
                contentStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  paddingTop: constants.STATUS_BAR_HEIGHT + 100,
                  padding: 20,
                }}
              >
                {this.renderSelectedItem()}
              </reactNativeSpringScrollview.SpringScrollView>
            </ReactNative.View>
          </ReactNative.Modal>
        </ReactNative.View>
      );
    }
    return <components.Spinkit />;
  }
}
var f = function ({text}) {
  return (
    <ReactNative.View style={p.titleCon}>
      {React.createElement(
        _default2,
        {
          style: [p.text, p.title],
        },
        '“ ',
        text,
        ' ”',
      )}
    </ReactNative.View>
  );
};
var p = ReactNative.StyleSheet.create({
  text: {
    color: '#c99f63',
    fontSize: 16,
  },
  titleCon: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  title: {
    fontSize: 30,
  },
});
export default CommentAnalysis;
