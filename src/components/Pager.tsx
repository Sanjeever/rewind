import React from 'react';
import {View} from 'react-native';
import PagerView from 'react-native-pager-view';
import type {PagerViewProps, PageScrollStateChangedNativeEventData} from 'react-native-pager-view';
import type {ViewProps} from 'react-native';
type Page = React.ReactElement<{style?: ViewProps['style']}> | null | undefined | false;
export type PagerProps = Omit<PagerViewProps, 'children' | 'onPageScrollStateChanged'> & {
  children?: Page | Page[];
  onPageScrollStateChanged?: (
    state: PageScrollStateChangedNativeEventData['pageScrollState'],
  ) => void;
};

export default React.forwardRef<PagerView, PagerProps>(function Pager(
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
