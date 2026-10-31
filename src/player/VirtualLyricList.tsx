import React from 'react';
import {FlatList} from 'react-native';
import type {FlatListProps} from 'react-native';
type ViewabilityEvent<T> = Parameters<NonNullable<FlatListProps<T>['onViewableItemsChanged']>>[0];
import type LyricDataSource from './LyricDataSource';
interface Props<T> extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> {
  dataSource: LyricDataSource<T>;
  renderItem(info: {item: T; index: number}): React.ReactElement | null;
  showVerticalScrollBar?: boolean;
  isScrollOverMode?: boolean;
  onVisibleItemsChange?: (indices: {firstIndex: number; lastIndex: number}) => void;
}

export default class LyricList<T> extends React.Component<Props<T>, {revision: number}> {
  list: FlatList<T> | null = null;
  state = {revision: 0};
  listener = {
    onPush: () => this.update(),
    onUnshift: () => this.update(),
    onSplice: () => this.update(),
    onSet: () => this.update(),
    onSetDirty: () => this.update(),
  };
  update() {
    this.setState(({revision}) => ({revision: revision + 1}));
  }
  componentDidMount() {
    this.props.dataSource._addListener(this.listener);
  }
  componentDidUpdate(previous: Props<T>) {
    if (previous.dataSource !== this.props.dataSource) {
      previous.dataSource._removeListener(this.listener);
      this.props.dataSource._addListener(this.listener);
    }
  }
  componentWillUnmount() {
    this.props.dataSource._removeListener(this.listener);
  }
  scrollToIndex = ({
    index,
    animated = true,
  }: {
    index: number;
    animated?: boolean;
    velocity?: number;
  }) => this.list!.scrollToIndex({index, animated, viewPosition: 0.5});
  onViewableItemsChanged = ({viewableItems}: ViewabilityEvent<T>) => {
    const firstIndex = viewableItems[0]?.index;
    const lastIndex = viewableItems[viewableItems.length - 1]?.index;
    if (firstIndex != null && lastIndex != null)
      this.props.onVisibleItemsChange?.({
        firstIndex,
        lastIndex,
      });
  };
  render() {
    const {
      dataSource,
      renderItem,
      showVerticalScrollBar,
      isScrollOverMode,
      onVisibleItemsChange,
      ...props
    } = this.props;
    const data = Array.from({length: dataSource.size()}, (_, index) => dataSource.get(index));
    return (
      <FlatList<T>
        {...props}
        ref={(list) => {
          this.list = list;
        }}
        data={data}
        extraData={this.state.revision}
        renderItem={({item, index}) => renderItem({item, index})}
        keyExtractor={(item, index) => dataSource.getKey(item, index)}
        showsVerticalScrollIndicator={showVerticalScrollBar}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onScrollToIndexFailed={({index, averageItemLength}) =>
          this.list!.scrollToOffset({offset: index * averageItemLength, animated: false})
        }
      />
    );
  }
}
