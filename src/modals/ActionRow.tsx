import Text from '../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import TouchableScale from '../components/TouchableScale';
class ActionRow extends React.PureComponent<{
  onPress?: () => void;
  title: string;
  value?: string | null;
  destructive?: boolean;
}> {
  render() {
    const props = this.props;
    const {onPress, title, value} = props;
    return (
      <TouchableScale
        accessibilityRole="button"
        onPress={function () {
          onPress?.();
        }}
        style={{
          width: '100%',
        }}
        activeScale={0.98}
      >
        <ReactNative.View
          style={{
            width: '100%',
            minHeight: 48,
            paddingVertical: 10,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
        >
          {value ? (
            <Text
              style={[
                u.text,
                u.listItemText,
                u.highlight,
                value.length > 10 && {
                  fontSize: 15,
                },
              ]}
            >
              {value}
            </Text>
          ) : null}
          <Text
            style={[
              u.text,
              u.listItemText,
              value && u.mini,
              props.destructive && {color: '#ff9090'},
            ]}
          >
            {title}
          </Text>
        </ReactNative.View>
      </TouchableScale>
    );
  }
}
export default ActionRow;
const u = ReactNative.StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: 'left',
  },
  listItemText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  mini: {
    marginTop: -2,
    fontSize: 12,
  },
  highlight: {
    fontWeight: 'bold',
  },
});
