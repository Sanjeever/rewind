import React from 'react';
import {View} from 'react-native';
import PagerView from 'react-native-pager-view';

export default React.forwardRef(function Pager(
  {children, onPageScrollStateChanged, ...props},
  ref,
) {
  return (
    <PagerView
      {...props}
      ref={ref}
      onPageScrollStateChanged={(event) =>
        onPageScrollStateChanged?.(event.nativeEvent.pageScrollState)
      }
    >
      {React.Children.map(
        children,
        (child, index) =>
          child && (
            <View key={index} style={{flex: 1}} collapsable={false}>
              {React.cloneElement(child, {style: [{flex: 1}, child.props.style]})}
            </View>
          ),
      )}
    </PagerView>
  );
});
