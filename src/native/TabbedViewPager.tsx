import React from 'react';
import {View, Text, Pressable} from 'react-native';
import PagerView from '../components/Pager';
import type {PagerProps} from '../components/Pager';
import type {ColorValue} from 'react-native';
interface Props extends PagerProps {
  tabNames?: string[];
  tabTextColor?: ColorValue;
  tabSelectedTextColor?: ColorValue;
  tabIndicatorColor?: ColorValue;
  tabBackground?: ColorValue;
  tabIndicatorHeight?: number;
}

export default class TabbedViewPager extends React.Component<Props> {
  pager: React.ComponentRef<typeof PagerView> | null = null;
  state = {index: this.props.initialPage ?? 0};
  setPage = (index: number) => this.pager!.setPage(index);
  setPageWithoutAnimation = (index: number) => this.pager!.setPageWithoutAnimation(index);
  render() {
    const {
      tabNames,
      tabTextColor = '#aaa',
      tabSelectedTextColor = '#fff',
      tabIndicatorColor = '#fff',
      tabBackground = 'transparent',
      tabIndicatorHeight = 2,
      style,
      onPageSelected,
      children,
      ...props
    } = this.props;
    return (
      <View style={[{flex: 1}, style]}>
        {tabNames && (
          <View style={{flexDirection: 'row', backgroundColor: tabBackground}}>
            {tabNames.map((title, index) => (
              <Pressable
                key={index}
                onPress={() => this.setPage(index)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  alignItems: 'center',
                  borderBottomWidth: tabIndicatorHeight,
                  borderBottomColor: index === this.state.index ? tabIndicatorColor : 'transparent',
                }}
              >
                <Text
                  style={{color: index === this.state.index ? tabSelectedTextColor : tabTextColor}}
                >
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <PagerView
          {...props}
          ref={(pager) => {
            this.pager = pager;
          }}
          style={{flex: 1}}
          initialPage={this.state.index}
          onPageSelected={(event) => {
            this.setState({index: event.nativeEvent.position});
            onPageSelected?.(event);
          }}
        >
          {React.Children.map(
            children,
            (child, index) =>
              child && (
                <View key={index} style={{flex: 1}} collapsable={false}>
                  {child}
                </View>
              ),
          )}
        </PagerView>
      </View>
    );
  }
}
