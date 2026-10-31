import {showTrackDetails} from '../../modals/commands';
import SongRow from '../tracks/SongRow';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LargeList} from '../../components/Scrolling';
import {Spinkit, TextButton} from '../../components';
import Text from '../../components/Text';
import {ITEM_HEIGHT} from '../../theme/constants';
import {searchSongs} from '../../services/search';
import {getAlias} from '../../services/trackFields';

import {playTracks, insertTracks} from '../../player/commands';
import type {DisplayTrack} from '../../services/track';
import type {OnlineProvider} from '../../services/providers';
interface Props {
  search: string;
  api: OnlineProvider;
}
interface State {
  tracks: DisplayTrack[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
}

export default class SongSearchResults extends React.PureComponent<Props, State> {
  list: LargeList<DisplayTrack> | null = null;
  state: State = {tracks: [], loading: false, error: null, hasMore: false};
  requestId = 0;
  offset = 0;
  pending = false;

  componentDidMount() {
    this.search();
  }

  componentDidUpdate(previous: Props) {
    if (previous.search !== this.props.search || previous.api !== this.props.api) this.search();
  }

  componentWillUnmount() {
    this.requestId++;
  }

  search = () => {
    const requestId = ++this.requestId;
    this.offset = 0;
    this.pending = false;
    this.setState({tracks: [], loading: true, error: null, hasMore: false});
    return this.fetchPage(requestId);
  };

  fetchPage = async (requestId = this.requestId) => {
    if (this.pending) return;
    this.pending = true;
    const {search: query, api} = this.props;
    try {
      const result = await searchSongs({query, api, offset: this.offset});
      if (requestId !== this.requestId) return;
      this.offset = result.offset;
      this.setState((state) => {
        const knownKeys = new Set(state.tracks.map((track) => track.key));
        return {
          tracks: [
            ...state.tracks,
            ...result.tracks.filter((track) => {
              if (knownKeys.has(track.key)) return false;
              knownKeys.add(track.key);
              return true;
            }),
          ],
          loading: false,
          error: null,
          hasMore: result.hasMore,
        };
      });
      this.list?.endLoading(!result.hasMore);
    } catch (error) {
      if (requestId !== this.requestId) return;
      this.setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
      this.list?.endLoading();
    } finally {
      if (requestId === this.requestId) this.pending = false;
    }
  };

  loadMore = () => {
    if (this.state.hasMore && !this.state.error) return this.fetchPage();
  };

  play = (track: DisplayTrack, index: number) => {
    playTracks({
      song: track.source,
      tracks: this.state.tracks.map((item) => item.source),
      index,
      api: track.api,
      type: 'insert',
    });
  };

  renderSong = ({row}: {row: number}) => {
    const track = this.state.tracks[row];
    return (
      <SongRow
        song={track.title}
        album={track.album === '空' ? '' : track.album}
        singer={track.artists.join('/')}
        img={track.artwork}
        songItem={track.source}
        round
        alias={getAlias(track.source)}
        onPress={() => this.play(track, row)}
        detail={() => showTrackDetails({song: track.source, index: row, api: track.api})}
        addToQueue={() => insertTracks({tracks: [track.source], api: track.api})}
      />
    );
  };

  renderStatus = () => {
    if (this.state.error)
      return (
        <View style={styles.status}>
          <Text selectable>{this.state.error.message}</Text>
          <TextButton text="重试" onPress={() => this.fetchPage()} style={{padding: 12}} />
        </View>
      );
    if (!this.state.tracks.length) return <Text style={styles.status}>无搜索结果</Text>;
    return null;
  };

  render() {
    if (this.state.loading) return <Spinkit />;
    return (
      <LargeList
        key={this.props.api + ':' + this.props.search}
        ref={(list) => {
          this.list = list;
        }}
        data={[{items: this.state.tracks}]}
        heightForIndexPath={() => ITEM_HEIGHT}
        renderIndexPath={this.renderSong}
        renderFooter={this.renderStatus}
        onLoading={this.state.hasMore && !this.state.error ? this.loadMore : undefined}
      />
    );
  }
}

const styles = StyleSheet.create({status: {padding: 20, alignItems: 'center'}});
