import Text from '../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import highlightWordsCore from 'highlight-words-core';
import * as formatItem from './formatItem';
class CommentBubble extends React.PureComponent<{
  item: formatItem.CommentItem | formatItem.CommentReply;
  title?: string;
  replied?: boolean;
}> {
  renderContent = () => {
    const props = this.props;
    const {item, title, replied} = props;
    const u = formatItem.getFormattedItem(item);
    if (title && u.content) {
      const textToHighlight = u.content;
      const b = highlightWordsCore.findAll({
        textToHighlight,
        searchWords: [title],
      });
      return (
        <components.Selectable
          style={[
            f.text,
            replied === true && {
              fontSize: 14,
            },
          ]}
        >
          {b.map((e, key) => {
            const r = textToHighlight.substr(e.start, e.end - e.start);
            if (e.highlight) {
              return (
                <Text key={key} style={f.highlight}>
                  {r}
                </Text>
              );
            }
            return r;
          })}
        </components.Selectable>
      );
    }
    return (
      <components.Selectable
        style={[
          f.text,
          replied === true && {
            fontSize: 14,
          },
        ]}
      >
        {u.content}
      </components.Selectable>
    );
  };
  render() {
    const props = this.props;
    const {replied, item} = props;
    const o = formatItem.getFormattedItem(item);
    return (
      <ReactNative.View
        style={[
          {
            alignItems: 'center',
            padding: 20,
            marginBottom: 20,
          },
          replied === true && {
            backgroundColor: '#1a1820',
            borderRadius: 5,
          },
        ]}
      >
        {!replied && React.createElement(c, null)}
        {this.renderContent()}
        <ReactNative.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <ReactNative.Image
            source={{
              uri: o.userAvatar,
            }}
            style={{
              height: 25,
              width: 25,
              borderRadius: 12.5,
            }}
          />
          <components.Selectable
            style={[
              f.text,
              {
                fontSize: 12,
                marginLeft: 3,
              },
            ]}
          >
            {o.userName}
          </components.Selectable>
        </ReactNative.View>
        {o.time ? (
          <Text
            style={[
              f.text,
              {
                fontSize: 10,
                marginTop: 5,
              },
            ]}
          >
            {o.time}
          </Text>
        ) : null}
      </ReactNative.View>
    );
  }
}
export default CommentBubble;
const c = function () {
  return (
    <React.Fragment>
      <ReactNative.View style={f.triangle} />
      <ReactNative.View style={f.triangle2} />
      <ReactNative.View style={f.outlineRight} />
      <ReactNative.View style={f.outlineLeft} />
      <ReactNative.View style={f.triangleBorderMsk} />
    </React.Fragment>
  );
};
const f = ReactNative.StyleSheet.create({
  text: {
    color: '#c99f63',
    fontSize: 16,
    letterSpacing: 1,
  },
  highlight: {
    color: '#d5a157',
    fontWeight: 'bold',
  },
  outlineLeft: {
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderColor: '#c99f63',
    position: 'absolute',
    backgroundColor: '#100f14',
  },
  outlineRight: {
    top: 0,
    left: 15,
    right: 0,
    bottom: 15,
    borderWidth: 1,
    borderColor: '#c99f63',
    position: 'absolute',
  },
  triangle: {
    position: 'absolute',
    bottom: -2,
    left: 8,
    borderLeftWidth: 12,
    borderBottomWidth: 12,
    borderColor: '#c99f63',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  triangle2: {
    position: 'absolute',
    bottom: 1,
    left: 9,
    borderLeftWidth: 7,
    borderBottomWidth: 7,
    borderColor: '#100f14',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  triangleBorderMsk: {
    width: 8,
    height: 1,
    position: 'absolute',
    bottom: 8,
    left: 9,
    backgroundColor: '#100f14',
  },
});
