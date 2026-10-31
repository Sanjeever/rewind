import Text from '../../components/Text';
import 'react';
import * as ReactNative from 'react-native';
import TouchableScale from '../../components/TouchableScale';
import * as components from '../../components/index';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
import locales from '../../locales/index';
import * as events from '../../events/index';
import * as utils from '../../utils/index';
import * as trackInfo from '../../services/trackInfo';
import type {responses} from '../../services/netease/responses';
import type * as z from 'zod/mini';
import type {TrackFields} from '../../services/track';
export type NewWork = NonNullable<
  z.output<typeof responses.sub_new_songs>['data']
>['newWorks'][number];
const GComponent = function (item: TrackFields, t: number) {
  const a = trackInfo.extractFullInfo(item);
  return (
    <components.SongRow
      key={t}
      index={null}
      song={a.song}
      singer={utils.timeFormatter.parseTime(item.dt! / 1000)}
      album={a.album}
      alias={a.alias}
      containerStyle={{
        height: 55,
      }}
      onPress={function () {
        return events.toPlayer({
          item,
          data: [item],
          index: t,
          api: 'netEase',
          type: 'insert',
        });
      }}
      detail={function () {
        return events.toDetailModal({
          item,
          index: t,
          api: 'netEase',
        });
      }}
    />
  );
};
const PComponent = ({item, onAlbum}: {item: NewWork; onAlbum(): void}) => {
  const {blockTitle, songLists} = item;
  const i = songLists.reduce((acc, songList) => acc + songList.dt!, 0);
  const subtitle = `${utils.timeFormatter.parseTime(i / 1000)}  |  ${songLists.length} ${locales.SONG_COUNT} `;
  return (
    <YComponent
      title={blockTitle.resourceName}
      subtitle={subtitle}
      onPage={onAlbum}
      onPress={function () {
        return events.toPlayer({
          item: songLists[0],
          data: songLists,
          index: 0,
          api: 'netEase',
          type: songLists.length > 1 ? undefined : 'insert',
        });
      }}
    />
  );
};
const YComponent = function ({
  title,
  subtitle,
  onPress,
  onPage,
}: {
  title: string;
  subtitle: string;
  onPress(): void;
  onPage(): void;
}) {
  return (
    <ReactNative.TouchableNativeFeedback onPress={onPress}>
      <ReactNative.View style={E.albumCon}>
        <ReactNative.View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 15,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </ReactNative.View>
        <components.Icon
          containerStyle={{
            height: 50,
            width: 50,
          }}
          onPress={onPage}
          size={20}
          name={icons.ALBUM}
          component={TouchableScale}
        />
      </ReactNative.View>
    </ReactNative.TouchableNativeFeedback>
  );
};
const E = ReactNative.StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  avatarCon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: constants.COLORS.primary,
  },
  songsCon: {
    paddingLeft: 45,
  },
  timeline: {
    width: 2,
    height: '100%',
    position: 'absolute',
    backgroundColor: constants.COLORS.primary,
    borderRadius: 5,
    top: 0,
    left: 20,
  },
  albumCon: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});
const HComponent = function ({
  item,
  onAlbum,
  onArtist,
}: {
  item: NewWork;
  onAlbum(): void;
  onArtist(): void;
}) {
  let n;
  const {blockType, blockTitle} = item;
  return (
    <ReactNative.View>
      <ReactNative.View style={E.timeline} />
      <ReactNative.View style={E.container}>
        <ReactNative.View style={E.avatarCon}>
          <TouchableScale onPress={onArtist}>
            <ReactNative.Image
              style={E.avatar}
              source={{
                uri: `${blockTitle.imgUrl}?param=100y100`,
              }}
            />
          </TouchableScale>
          <ReactNative.View>
            <components.Title
              style={{
                fontSize: 15,
              }}
            >
              {blockTitle.artistName}
            </components.Title>
            <Text
              style={{
                opacity: 0.8,
                fontSize: 13,
              }}
            >
              {
                ((n =
                  blockType === 'song'
                    ? locales.ARTIST_SONGS?.toLowerCase()
                    : locales.ARTIST_ALBUM?.toLowerCase()),
                `${locales.PUBLISHED}${n}`)
              }
            </Text>
          </ReactNative.View>
        </ReactNative.View>
        <ReactNative.View style={E.songsCon}>
          {blockType === 'song'
            ? item.songLists.map(GComponent)
            : PComponent({
                item,
                onAlbum,
              })}
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  );
};
export default HComponent;
