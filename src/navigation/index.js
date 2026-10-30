Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var reactNavigation = require("react-navigation"),
  About = babelHelpers.interopRequireDefault(require("../screens/About")),
  AlbumPage = babelHelpers.interopRequireDefault(require("../screens/AlbumPage")),
  ArtistPage = babelHelpers.interopRequireDefault(require("../screens/ArtistPage")),
  CommentPage = babelHelpers.interopRequireDefault(require("../screens/CommentPage")),
  CustomPlaylist = babelHelpers.interopRequireDefault(require("../screens/CustomPlaylist")),
  HappyBirthday = babelHelpers.interopRequireDefault(require("../screens/HappyBirthday")),
  CachePage = babelHelpers.interopRequireDefault(require("../screens/CachePage")),
  FeaturePage = babelHelpers.interopRequireDefault(require("../screens/FeaturePage")),
  LanguagePage = babelHelpers.interopRequireDefault(require("../screens/LanguagePage")),
  MusicNotificationPage = babelHelpers.interopRequireDefault(require("../screens/MusicNotificationPage")),
  OrderPage = babelHelpers.interopRequireDefault(require("../screens/OrderPage")),
  Skin = babelHelpers.interopRequireDefault(require("../screens/Skin")),
  Home = babelHelpers.interopRequireDefault(require("../screens/Home")),
  ListenRecord = babelHelpers.interopRequireDefault(require("../screens/ListenRecord")),
  LocalMusic = babelHelpers.interopRequireDefault(require("../screens/LocalMusic")),
  InitialLogin = babelHelpers.interopRequireDefault(require("../screens/InitialLogin")),
  NeteaseLogin = babelHelpers.interopRequireDefault(require("../screens/NeteaseLogin")),
  QQMusicLogin = babelHelpers.interopRequireDefault(require("../screens/QQMusicLogin")),
  LyricPage = babelHelpers.interopRequireDefault(require("../screens/LyricPage")),
  MusicHistory = babelHelpers.interopRequireDefault(require("../screens/MusicHistory")),
  Charts = babelHelpers.interopRequireDefault(require("../screens/Charts")),
  Cloud = babelHelpers.interopRequireDefault(require("../screens/Cloud")),
  Favs = babelHelpers.interopRequireDefault(require("../screens/Favs")),
  HotPlaylist = babelHelpers.interopRequireDefault(require("../screens/HotPlaylist")),
  Msg = babelHelpers.interopRequireDefault(require("../screens/Msg")),
  MsgHistory = babelHelpers.interopRequireDefault(require("../screens/MsgHistory")),
  Radio = babelHelpers.interopRequireDefault(require("../screens/Radio")),
  RadioDetail = babelHelpers.interopRequireDefault(require("../screens/RadioDetail")),
  MusicRecommend = babelHelpers.interopRequireDefault(require("../screens/MusicRecommend")),
  SubNewSongs = babelHelpers.interopRequireDefault(require("../screens/SubNewSongs")),
  Playlist = babelHelpers.interopRequireDefault(require("../screens/Playlist")),
  PlaylistIntersection = babelHelpers.interopRequireDefault(require("../screens/PlaylistIntersection")),
  SearchPage = babelHelpers.interopRequireDefault(require("../screens/SearchPage")),
  Settings = babelHelpers.interopRequireDefault(require("../screens/Settings")),
  Tip = babelHelpers.interopRequireDefault(require("../screens/Tip")),
  FollowPage = babelHelpers.interopRequireDefault(require("../screens/FollowPage")),
  UserInfo = babelHelpers.interopRequireDefault(require("../screens/UserInfo")),
  UserManager = babelHelpers.interopRequireDefault(require("../screens/UserManager")),
  Video = babelHelpers.interopRequireDefault(require("../screens/Video")),
  WebViewPage = babelHelpers.interopRequireDefault(require("../screens/WebViewPage")),
  z = (0, reactNavigation.StackNavigator)({
    Home: {
      screen: Home.default
    },
    Skin: {
      screen: Skin.default
    },
    About: {
      screen: About.default
    },
    SearchPage: {
      screen: SearchPage.default
    },
    Settings: {
      screen: Settings.default
    },
    MusicHistory: {
      screen: MusicHistory.default
    },
    CustomPlaylist: {
      screen: CustomPlaylist.default
    },
    NeteaseLogin: {
      screen: NeteaseLogin.default
    },
    QQMusicLogin: {
      screen: QQMusicLogin.default
    },
    InitialLogin: {
      screen: InitialLogin.default
    },
    Playlist: {
      screen: Playlist.default
    },
    LocalMusic: {
      screen: LocalMusic.default
    },
    ArtistPage: {
      screen: ArtistPage.default
    },
    AlbumPage: {
      screen: AlbumPage.default
    },
    Msg: {
      screen: Msg.default
    },
    MsgHistory: {
      screen: MsgHistory.default
    },
    MusicRecommend: {
      screen: MusicRecommend.default
    },
    Radio: {
      screen: Radio.default
    },
    RadioDetail: {
      screen: RadioDetail.default
    },
    Charts: {
      screen: Charts.default
    },
    HotPlaylist: {
      screen: HotPlaylist.default
    },
    Favs: {
      screen: Favs.default
    },
    CachePage: {
      screen: CachePage.default
    },
    WebViewPage: {
      screen: WebViewPage.default
    },
    Tip: {
      screen: Tip.default
    },
    Cloud: {
      screen: Cloud.default
    },
    UserManager: {
      screen: UserManager.default
    },
    UserInfo: {
      screen: UserInfo.default
    },
    FollowPage: {
      screen: FollowPage.default
    },
    LanguagePage: {
      screen: LanguagePage.default
    },
    FeaturePage: {
      screen: FeaturePage.default
    },
    OrderPage: {
      screen: OrderPage.default
    },
    MusicNotificationPage: {
      screen: MusicNotificationPage.default
    },
    CommentPage: {
      screen: CommentPage.default
    },
    ListenRecord: {
      screen: ListenRecord.default
    },
    PlaylistIntersection: {
      screen: PlaylistIntersection.default
    },
    LyricPage: {
      screen: LyricPage.default
    },
    HappyBirthday: {
      screen: HappyBirthday.default
    },
    SubNewSongs: {
      screen: SubNewSongs.default
    },
    Video: {
      screen: Video.default
    }
  }, {
    headerMode: 'null',
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode: 'locked-closed'
    }
  });
exports.default = z;
