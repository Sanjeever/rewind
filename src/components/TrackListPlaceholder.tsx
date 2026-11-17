import React from 'react';
import * as ReactNative from 'react-native';
import PulsingPlaceholder from './PulsingPlaceholder';
import {ITEM_HEIGHT} from '../theme/constants';

export default function TrackListPlaceholder() {
  return (
    <ReactNative.View accessibilityRole="progressbar" accessibilityLabel="正在加载歌曲">
      <ReactNative.View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {Array.from({length: 5}, (_, index) => (
          <ReactNative.View
            key={index}
            style={{
              height: ITEM_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              gap: 20,
            }}
          >
            <PulsingPlaceholder style={{width: 12, height: 12, borderRadius: 3}} />
            <ReactNative.View style={{flex: 1, gap: 10}}>
              <PulsingPlaceholder
                style={{width: index % 2 ? '55%' : '70%', height: 14, borderRadius: 4}}
              />
              <PulsingPlaceholder style={{width: '40%', height: 10, borderRadius: 3}} />
            </ReactNative.View>
          </ReactNative.View>
        ))}
      </ReactNative.View>
    </ReactNative.View>
  );
}
