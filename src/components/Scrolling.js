import React from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, SectionList, View} from 'react-native';

export class RefreshHeader extends React.Component {
  state = {status: 'idle'};
}

function trackOffset(event, offset, listener) {
  if (offset) {
    offset.x?.setValue(event.nativeEvent.contentOffset.x);
    offset.y?.setValue(event.nativeEvent.contentOffset.y);
  }
  listener?.(event);
}

export class SpringScrollView extends React.Component {
  state = {refreshing: false, loading: false, allLoaded: false};
  scrollTo = options => this.scrollView.scrollTo(options);
  endRefresh = () => this.setState({refreshing: false});
  endLoading = (allLoaded = false) => this.setState({loading: false, allLoaded});
  refresh = () => {
    this.setState({refreshing: true});
    const pending = this.props.onRefresh();
    if (pending?.finally) pending.finally(this.endRefresh);
  };
  loadMore = () => {
    if (this.state.loading || this.state.allLoaded || !this.props.onLoading) return;
    this.setState({loading: true}, () => {
      const pending = this.props.onLoading();
      if (pending?.finally) pending.finally(() => this.endLoading());
    });
  };
  onScroll = event => {
    trackOffset(event, this.props.onNativeContentOffsetExtract, this.props.onScroll);
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 120) this.loadMore();
  };
  render() {
    const {onRefresh, onLoading, onNativeContentOffsetExtract, refreshHeader, loadingFooter,
      renderHeader, renderFooter, children, style, ...props} = this.props;
    return <ScrollView {...props} style={[{flex: 1}, style]} ref={view => { this.scrollView = view; }}
      showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={this.onScroll}
      refreshControl={onRefresh ? <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} tintColor="#fff" colors={['#fff']} /> : undefined}>
      {renderHeader?.()}{children}{renderFooter?.()}
      {this.state.loading && <ActivityIndicator color="#fff" style={{padding: 16}} />}
    </ScrollView>;
  }
}

export class LargeList extends React.Component {
  state = {refreshing: false, loading: false, allLoaded: false};
  scrollTo = options => this.list.getScrollResponder()?.scrollTo(options);
  endRefresh = () => this.setState({refreshing: false});
  endLoading = (allLoaded = false) => this.setState({loading: false, allLoaded});
  refresh = () => {
    this.setState({refreshing: true});
    const pending = this.props.onRefresh();
    if (pending?.finally) pending.finally(this.endRefresh);
  };
  loadMore = () => {
    if (this.state.loading || this.state.allLoaded || !this.props.onLoading) return;
    this.setState({loading: true}, () => {
      const pending = this.props.onLoading();
      if (pending?.finally) pending.finally(() => this.endLoading());
    });
  };
  render() {
    const {data, renderIndexPath, heightForIndexPath, renderHeader, renderFooter, renderEmpty,
      renderSection, heightForSection, onRefresh, onLoading, onNativeContentOffsetExtract,
      refreshHeader, loadingFooter, onScroll, ...props} = this.props;
    const sections = data.map((section, index) => ({...section, index, key: String(index), data: section.items}));
    return <SectionList {...props} ref={list => { this.list = list; }} sections={sections}
      style={[{flex: 1}, props.style]} stickySectionHeadersEnabled={false}
      keyExtractor={(_, index) => String(index)}
      renderItem={({index, section}) => <View style={heightForIndexPath ? {height: heightForIndexPath({section: section.index, row: index})} : undefined}>
        {renderIndexPath({section: section.index, row: index})}
      </View>}
      renderSectionHeader={renderSection ? ({section}) => <View style={heightForSection ? {height: heightForSection(section.index)} : undefined}>{renderSection(section.index)}</View> : undefined}
      ListHeaderComponent={renderHeader} ListEmptyComponent={renderEmpty}
      ListFooterComponent={<>{renderFooter?.()}{this.state.loading && <ActivityIndicator color="#fff" style={{padding: 16}} />}</>}
      refreshing={this.state.refreshing} onRefresh={onRefresh ? this.refresh : undefined}
      onEndReached={this.loadMore} onEndReachedThreshold={0.3}
      onScroll={event => trackOffset(event, onNativeContentOffsetExtract, onScroll)} scrollEventThrottle={16} />;
  }
}
