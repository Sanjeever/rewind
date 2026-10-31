const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  Placeholders = _interopRequireDefault(require('./Placeholders')),
  styles = _interopRequireDefault(require('./styles')),
  i = function (e) {
    var t = e.info;
    return React.default.createElement(
      React.default.Fragment,
      null,
      React.default.createElement(Placeholders.default.Text, {
        style: [
          styles.default.text,
          {
            marginBottom: 10,
            paddingLeft: 9,
          },
        ],
        numbers: 22,
      }),
      t.sites.map(function (e, t) {
        return React.default.createElement(
          ReactNative.View,
          {
            style: styles.default.itemStyle,
            key: t,
          },
          React.default.createElement(Placeholders.default.Avatar, {
            style: styles.default.avatar,
          }),
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                marginHorizontal: 10,
                flex: 1,
              },
            },
            React.default.createElement(Placeholders.default.Text, {
              style: [
                styles.default.text,
                {
                  marginLeft: 5,
                },
              ],
              numbers: 8,
            }),
            React.default.createElement(Placeholders.default.Text, {
              style: [
                styles.default.text,
                {
                  marginLeft: 5,
                  fontSize: 13,
                },
              ],
              numbers: 12,
            }),
          ),
        );
      }),
      React.default.createElement(Placeholders.default.Text, {
        style: [
          styles.default.title,
          {
            fontSize: 16,
            marginLeft: 5,
          },
        ],
        numbers: 3,
      }),
      t.persons.map(function (e, t) {
        return React.default.createElement(
          ReactNative.View,
          {
            style: styles.default.itemStyle,
            key: t,
          },
          React.default.createElement(Placeholders.default.Avatar, {
            style: styles.default.avatar,
          }),
          React.default.createElement(
            ReactNative.View,
            {
              style: {
                paddingHorizontal: 10,
                flex: 1,
              },
            },
            React.default.createElement(Placeholders.default.Text, {
              style: [styles.default.text],
              numbers: 5,
            }),
            React.default.createElement(Placeholders.default.Text, {
              style: [
                styles.default.text,
                {
                  fontSize: 13,
                },
              ],
              numbers: 10,
            }),
          ),
        );
      }),
      React.default.createElement(Placeholders.default.Text, {
        style: [
          styles.default.title,
          {
            fontSize: 16,
            marginLeft: 5,
          },
        ],
        numbers: 3,
      }),
      React.default.createElement(
        ReactNative.View,
        {
          style: [
            styles.default.osCon,
            {
              paddingLeft: 15,
            },
          ],
        },
        React.default.createElement(Placeholders.default.Text, {
          numberOfLines: 1,
          style: [styles.default.text],
          numbers: 3,
        }),
        React.default.createElement(Placeholders.default.Text, {
          numberOfLines: 1,
          style: [styles.default.text],
        }),
      ),
    );
  };
exports.default = i;
