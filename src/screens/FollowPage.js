import * as React from 'react';
import * as ReactNative from 'react-native';
import reactNativeTabView from 'react-native-tab-view';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import * as constants from '../theme/constants';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as types from '../utils/types';
import UserHeader from './../modules/UserHeader.js';
const tabViewHeight = constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - constants.ITEM_HEIGHT;
class FollowPage extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  _tabViewHeights = [0, 0];
  state = {
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
  getFollows = async (id, offset) => {
    const response = await services.Netease.user_follows(id, offset);
    if (response?.code === 200) {
      this.setState((previous) => ({
        follows: [...previous.follows, ...response.follow],
      }));
      this._list?.endLoading?.();
    }
  };
  getFolloweds = async (id, offset) => {
    const response = await services.Netease.user_followeds(id, offset);
    if (response?.code === 200) {
      this.setState((previous) => ({
        followeds: [...previous.followeds, ...response.followeds],
      }));
      this._list?.endLoading?.();
    }
  };
  getMore = () => {
    const r_state = this.state;
    const {follows, followeds, userId, index} = r_state;
    if (index === 0) {
      const o = follows.length;
      this.getFollows(userId, o);
    } else if (index === 1) {
      const i = followeds.length;
      this.getFolloweds(userId, i);
    }
  };
  _handleIndexChange = (e) => {
    return this.setState({
      index: e,
      tabViewHeight: this._tabViewHeights[e],
    });
  };
  _renderHeader = (e) => {
    return (
      <reactNativeTabView.TabBar
        pressColor={'rgba(0,0,0,0.3)'}
        renderText={this._renderText}
        tabStyle={{
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        labelStyle={{
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        indicatorStyle={{
          backgroundColor: constants.COLORS.primary,
        }}
        style={{
          marginTop: 0,
          backgroundColor: 0,
          elevation: 0,
        }}
        {...e}
      />
    );
  };
  _renderScene = ({route}) => {
    const r_state = this.state;
    const {follows, followeds} = r_state;
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
        return <components.Spinkit />;
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
        return <components.Spinkit />;
      default:
        return null;
    }
  };
  onTabViewLayout = (e, t) => {
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
  onUserInfo = (e) => {
    this.props.navigation.navigate('UserInfo', {
      userId: e.userId,
    });
  };
  onSelectedUser = function (e) {
    events.emitter.emit(names.SelectedUser, e);
  };
  renderItem = ({item}) => {
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
  render() {
    const e = this;
    const state = this.state;
    const {profile, followed, tabViewHeight} = state;
    return (
      <ReactNative.View style={m.container}>
        <components.Background />
        <components.ParallaxScrollView
          onRef={function (t) {
            return (e._list = t);
          }}
          onLoading={this.getMore}
          onNativeContentOffsetExtract={this._nativeOffset}
          loadingFooter={ParallaxList}
        >
          <UserHeader
            nativeOffset={this._nativeOffset}
            profile={profile}
            followed={followed}
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
var m = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
