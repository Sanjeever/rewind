import tabIcons from '../theme/tabIcons';
import locales from '../locales/index';
const f = {
  pages: [
    {
      title: locales.LOCAL_MUSIC,
      page: 'localMusic',
      icon: tabIcons.LOCAL,
    },
    {
      title: locales.RECENT_PLAY,
      page: 'history',
      icon: tabIcons.HISTORY,
    },
    {
      title: locales.RECOMMEND,
      page: 'recommend',
      icon: tabIcons.DATE,
    },
    {
      title: locales.FAVS,
      page: 'favs',
      icon: tabIcons.FAVS,
    },
    {
      title: locales.RADIOS,
      page: 'radio',
      icon: tabIcons.RADIO,
    },
    {
      title: locales.PRIVATE_FM,
      page: 'privateFM',
      icon: tabIcons.FM,
    },
    {
      title: locales.HOT_PLAYLISTS,
      page: 'hotPlaylist',
      icon: tabIcons.PLAY_LIST,
    },
    {
      title: locales.CHARTS,
      page: 'charts',
      icon: tabIcons.CHARTS,
    },
    {
      title: locales.SUB_NEW_SONGS,
      page: 'subNewSongs',
      icon: tabIcons.SUB_NEW_SONGS,
    },
  ],
  apis: ['custom', 'netEase', 'qqMusic'],
};
export default f;
