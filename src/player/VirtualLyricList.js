import React from 'react';
import {FlatList} from 'react-native';

export default class LyricList extends React.Component {
  state = {revision: 0};
  listener = {
    onPush: () => this.update(), onUnshift: () => this.update(), onSplice: () => this.update(),
    onSet: () => this.update(), onSetDirty: () => this.update(),
  };
  update() { this.setState(({revision}) => ({revision: revision + 1})); }
  componentDidMount() { this.props.dataSource._addListener(this.listener); }
  componentDidUpdate(previous) {
    if (previous.dataSource !== this.props.dataSource) {
      previous.dataSource._removeListener(this.listener);
      this.props.dataSource._addListener(this.listener);
    }
  }
  componentWillUnmount() { this.props.dataSource._removeListener(this.listener); }
  scrollToIndex = ({index, animated = true}) => this.list.scrollToIndex({index, animated, viewPosition: 0.5});
  onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems.length) this.props.onVisibleItemsChange?.({firstIndex: viewableItems[0].index, lastIndex: viewableItems[viewableItems.length - 1].index});
  };
  render() {
    const {dataSource, renderItem, showVerticalScrollBar, isScrollOverMode, onVisibleItemsChange, ...props} = this.props;
    const data = Array.from({length: dataSource.size()}, (_, index) => dataSource.get(index));
    return <FlatList {...props} ref={list => { this.list = list; }} data={data} extraData={this.state.revision}
      renderItem={({item, index}) => renderItem({item, index})} keyExtractor={(item, index) => dataSource.getKey(item, index)}
      showsVerticalScrollIndicator={showVerticalScrollBar} onViewableItemsChanged={this.onViewableItemsChanged}
      onScrollToIndexFailed={({index, averageItemLength}) => this.list.scrollToOffset({offset: index * averageItemLength, animated: false})} />;
  }
}
