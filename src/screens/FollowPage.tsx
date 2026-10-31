import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeTabView from 'react-native-tab-view';
import type {TabBarProps, Route, SceneRendererProps, NavigationState} from 'react-native-tab-view';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import * as constants from '../theme/constants';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as types from '../utils/types';
import UserHeader from './../modules/UserHeader';
import type {ScreenProps, UserProfile} from '../navigation/types';
import type {TrackId} from '../services/track';
import type {SpringScrollView} from '../components/Scrolling';
import {errorMessage} from '../utils/types';
const tabViewHeight = constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - constants.ITEM_HEIGHT;
interface State extends NavigationState<Route> {
  profile: Partial<UserProfile>;
  follows: UserProfile[];
  followeds: UserProfile[];
  userId: TrackId | null;
  followed?: boolean;
  tabViewHeight: number;
  followsLoaded: boolean;
  followedsLoaded: boolean;
}
class FollowPage extends React.PureComponent<ScreenProps<'FollowPage'>, State> {
  _list: SpringScrollView | null = null;
  mounted = false;
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  _tabViewHeights = [0, 0];
  state: State = {
    followsLoaded: false,
    followedsLoaded: false,
    profile: {},
    follows: [],
    followeds: [],
    userId: null,
    followed: true,
    tabViewHeight,
    index: 0,
    routes: [
      {
        key: '1',
        title: locales.FOLLOWS,
      },
      {
        key: '2',
        title: locales.FOLLOWER,
      },
    ],
  };
  getFollows = async (id: TrackId, offset?: number) => {
    try {
      const response = await services.Netease.user_follows(id, offset);
      if (!this.mounted) return;
      if (response?.code === 200 && response.follow) {
        const follow = response.follow;
        this.setState((previous) => ({
          follows: [...previous.follows, ...follow],
        }));
        this._list?.endLoading?.();
      }
    } catch (error) {
      if (this.mounted) toast(errorMessage(error));
    } finally {
      if (this.mounted) {
        this.setState({followsLoaded: true});
        this._list?.endLoading();
      }
    }
  };
  getFolloweds = async (id: TrackId, offset?: number) => {
    try {
      const response = await services.Netease.user_followeds(id, offset);
      if (!this.mounted) return;
      if (response?.code === 200 && response.followeds) {
        const followeds = response.followeds;
        this.setState((previous) => ({
          followeds: [...previous.followeds, ...followeds],
        }));
        this._list?.endLoading?.();
      }
    } catch (error) {
      if (this.mounted) toast(errorMessage(error));
    } finally {
      if (this.mounted) {
        this.setState({followedsLoaded: true});
        this._list?.endLoading();
      }
    }
  };
  getMore = () => {
    const state = this.state;
    const {follows, followeds, userId, index} = state;
    if (userId == null) return;
    if (index === 0) {
      const o = follows.length;
      this.getFollows(userId, o);
    } else if (index === 1) {
      const i = followeds.length;
      this.getFolloweds(userId, i);
    }
  };
  _handleIndexChange = (e: number) => {
    return this.setState({
      index: e,
      tabViewHeight: this._tabViewHeights[e],
    });
  };
  _renderHeader = (e: TabBarProps<Route>) => {
    return (
      <reactNativeTabView.TabBar
        pressColor={'rgba(0,0,0,0.3)'}
        tabStyle={{
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        options={Object.fromEntries(
          this.state.routes.map((route) => [
            route.key,
            {labelStyle: {backgroundColor: 'rgba(0,0,0,0)'}},
          ]),
        )}
        indicatorStyle={{
          backgroundColor: constants.COLORS.primary,
        }}
        style={{
          marginTop: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        }}
        {...e}
      />
    );
  };
  _renderScene = ({route}: SceneRendererProps & {route: Route}) => {
    const state = this.state;
    const {follows, followeds} = state;
    switch (route.key) {
      case '1':
        if (follows?.length > 0) {
          return (
            <ReactNative.View
              onLayout={(e) => {
                return this.onTabViewLayout(e, 0);
              }}
            >
              {follows.map((e, t) =>
                this.renderItem({
                  item: e,
                  index: t,
                }),
              )}
            </ReactNative.View>
          );
        }
        return this.state.followsLoaded ? <ReactNative.View /> : <components.Spinkit />;
      case '2':
        if (followeds?.length > 0) {
          return (
            <ReactNative.View
              onLayout={(e) => {
                return this.onTabViewLayout(e, 1);
              }}
            >
              {followeds.map((e, t) =>
                this.renderItem({
                  item: e,
                  index: t,
                }),
              )}
            </ReactNative.View>
          );
        }
        return this.state.followedsLoaded ? <ReactNative.View /> : <components.Spinkit />;
      default:
        return null;
    }
  };
  onTabViewLayout = (e: ReactNative.LayoutChangeEvent, t: number) => {
    const height = e.nativeEvent.layout.height;
    if (height) {
      if (t === 0) {
        this.setState({
          tabViewHeight: height,
        });
      }
      this._tabViewHeights[t] = height;
    }
  };
  onHeart = async () => {
    const {followed, userId} = this.state;
    if (userId == null) return;
    const response = await services.Netease.follow_user({
      uid: userId,
      type: followed ? 0 : 1,
    });
    if (response?.code !== 200) {
      toast(locales.ERROR);
      return;
    }
    this.setState({
      followed: !followed,
    });
  };
  onUserInfo = (e: UserProfile) => {
    this.props.navigation.navigate('UserInfo', {
      userId: e.userId,
    });
  };
  onSelectedUser = function (e: UserProfile) {
    events.emitter.emit(names.SelectedUser, e);
  };
  renderItem = ({item}: {item: UserProfile; index?: number}) => {
    return (
      <components.ListItem
        img={`${item.avatarUrl}?param=200y200`}
        title={item.nickname}
        subtitle={item.signature}
        vip={item.userType !== 0}
        onPress={() => {
          return this.onUserInfo(item);
        }}
        onLongPress={() => {
          return this.onSelectedUser(item);
        }}
      />
    );
  };
  componentDidMount() {
    this.mounted = true;
    const params = this.props.route.params;
    if (types.isObject(params)) {
      const profile = params.profile;
      if (types.isObject(profile)) {
        const {userId, followed} = profile;
        this.setState({
          profile,
          userId,
          followed,
        });
        this.getFollows(userId);
        this.getFolloweds(userId);
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  render() {
    const state = this.state;
    const {profile, followed, tabViewHeight} = state;
    return (
      <ReactNative.View style={m.container}>
        <components.Background />
        <components.ParallaxScrollView
          onRef={(t) => {
            return (this._list = t);
          }}
          onLoading={this.getMore}
          onNativeContentOffsetExtract={this._nativeOffset}
          loadingFooter={ParallaxList}
        >
          <UserHeader
            nativeOffset={this._nativeOffset}
            profile={profile}
            followed={!!followed}
            onHeart={this.onHeart}
          />
          <reactNativeTabView.TabView
            style={{
              height: tabViewHeight + 50,
            }}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
          />
        </components.ParallaxScrollView>
      </ReactNative.View>
    );
  }
}
export default FollowPage;
const m = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
