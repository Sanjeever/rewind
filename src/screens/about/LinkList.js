import 'react';
import * as ReactNative from 'react-native';
import Placeholders from './Placeholders';
import styles from './styles';
const IComponent = function ({info}) {
  return (
    <>
      <Placeholders.Text
        style={[
          styles.text,
          {
            marginBottom: 10,
            paddingLeft: 9,
          },
        ]}
        numbers={22}
      />
      {info.sites.map((e, t) => (
        <ReactNative.View style={styles.itemStyle} key={t}>
          <Placeholders.Avatar style={styles.avatar} />
          <ReactNative.View
            style={{
              marginHorizontal: 10,
              flex: 1,
            }}
          >
            <Placeholders.Text
              style={[
                styles.text,
                {
                  marginLeft: 5,
                },
              ]}
              numbers={8}
            />
            <Placeholders.Text
              style={[
                styles.text,
                {
                  marginLeft: 5,
                  fontSize: 13,
                },
              ]}
              numbers={12}
            />
          </ReactNative.View>
        </ReactNative.View>
      ))}
      <Placeholders.Text
        style={[
          styles.title,
          {
            fontSize: 16,
            marginLeft: 5,
          },
        ]}
        numbers={3}
      />
      {info.persons.map((e, t) => (
        <ReactNative.View style={styles.itemStyle} key={t}>
          <Placeholders.Avatar style={styles.avatar} />
          <ReactNative.View
            style={{
              paddingHorizontal: 10,
              flex: 1,
            }}
          >
            <Placeholders.Text style={[styles.text]} numbers={5} />
            <Placeholders.Text
              style={[
                styles.text,
                {
                  fontSize: 13,
                },
              ]}
              numbers={10}
            />
          </ReactNative.View>
        </ReactNative.View>
      ))}
      <Placeholders.Text
        style={[
          styles.title,
          {
            fontSize: 16,
            marginLeft: 5,
          },
        ]}
        numbers={3}
      />
      <ReactNative.View
        style={[
          styles.osCon,
          {
            paddingLeft: 15,
          },
        ]}
      >
        <Placeholders.Text numberOfLines={1} style={[styles.text]} numbers={3} />
        <Placeholders.Text numberOfLines={1} style={[styles.text]} />
      </ReactNative.View>
    </>
  );
};
export default IComponent;
