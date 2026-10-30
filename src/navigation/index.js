Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var reactNavigation = require("react-navigation"),
  AboutModule = babelHelpers.interopRequireDefault(require("../screens/About")),
  AlbumPageModule = babelHelpers.interopRequireDefault(require("../screens/AlbumPage")),
  ArtistPageModule = babelHelpers.interopRequireDefault(require("../screens/ArtistPage")),
  CommentPageModule = babelHelpers.interopRequireDefault(require("../screens/CommentPage")),
  CustomPlaylistModule = babelHelpers.interopRequireDefault(require("../screens/CustomPlaylist")),
  HappyBirthdayModule = babelHelpers.interopRequireDefault(require("../screens/HappyBirthday")),
  CachePageModule = babelHelpers.interopRequireDefault(require("../screens/CachePage")),
  FeaturePageModule = babelHelpers.interopRequireDefault(require("../screens/FeaturePage")),
  LanguagePageModule = babelHelpers.interopRequireDefault(require("../screens/LanguagePage")),
  MusicNotificationPageModule = babelHelpers.interopRequireDefault(require("../screens/MusicNotificationPage")),
  OrderPageModule = babelHelpers.interopRequireDefault(require("../screens/OrderPage")),
  SkinModule = babelHelpers.interopRequireDefault(require("../screens/Skin")),
  HomeModule = babelHelpers.interopRequireDefault(require("../screens/Home")),
  ListenRecordModule = babelHelpers.interopRequireDefault(require("../screens/ListenRecord")),
  LocalMusicModule = babelHelpers.interopRequireDefault(require("../screens/LocalMusic")),
  InitialLoginModule = babelHelpers.interopRequireDefault(require("../screens/InitialLogin")),
  NeteaseLoginModule = babelHelpers.interopRequireDefault(require("../screens/NeteaseLogin")),
  QQMusicLoginModule = babelHelpers.interopRequireDefault(require("../screens/QQMusicLogin")),
  LyricPageModule = babelHelpers.interopRequireDefault(require("../screens/LyricPage")),
  MusicHistoryModule = babelHelpers.interopRequireDefault(require("../screens/MusicHistory")),
  ChartsModule = babelHelpers.interopRequireDefault(require("../screens/Charts")),
  CloudModule = babelHelpers.interopRequireDefault(require("../screens/Cloud")),
  FavsModule = babelHelpers.interopRequireDefault(require("../screens/Favs")),
  HotPlaylistModule = babelHelpers.interopRequireDefault(require("../screens/HotPlaylist")),
  MsgModule = babelHelpers.interopRequireDefault(require("../screens/Msg")),
  MsgHistoryModule = babelHelpers.interopRequireDefault(require("../screens/MsgHistory")),
  RadioModule = babelHelpers.interopRequireDefault(require("../screens/Radio")),
  RadioDetailModule = babelHelpers.interopRequireDefault(require("../screens/RadioDetail")),
  MusicRecommendModule = babelHelpers.interopRequireDefault(require("../screens/MusicRecommend")),
  SubNewSongsModule = babelHelpers.interopRequireDefault(require("../screens/SubNewSongs")),
  PlaylistModule = babelHelpers.interopRequireDefault(require("../screens/Playlist")),
  PlaylistIntersectionModule = babelHelpers.interopRequireDefault(require("../screens/PlaylistIntersection")),
  SearchPageModule = babelHelpers.interopRequireDefault(require("../screens/SearchPage")),
  SettingsModule = babelHelpers.interopRequireDefault(require("../screens/Settings")),
  TipModule = babelHelpers.interopRequireDefault(require("../screens/Tip")),
  FollowPageModule = babelHelpers.interopRequireDefault(require("../screens/FollowPage")),
  UserInfoModule = babelHelpers.interopRequireDefault(require("../screens/UserInfo")),
  UserManagerModule = babelHelpers.interopRequireDefault(require("../screens/UserManager")),
  VideoModule = babelHelpers.interopRequireDefault(require("../screens/Video")),
  WebViewPageModule = babelHelpers.interopRequireDefault(require("../screens/WebViewPage")),
  z = (0, reactNavigation.StackNavigator)({
    Home: {
      screen: HomeModule.default
    },
    Skin: {
      screen: SkinModule.default
    },
    About: {
      screen: AboutModule.default
    },
    SearchPage: {
      screen: SearchPageModule.default
    },
    Settings: {
      screen: SettingsModule.default
    },
    MusicHistory: {
      screen: MusicHistoryModule.default
    },
    CustomPlaylist: {
      screen: CustomPlaylistModule.default
    },
    NeteaseLogin: {
      screen: NeteaseLoginModule.default
    },
    QQMusicLogin: {
      screen: QQMusicLoginModule.default
    },
    InitialLogin: {
      screen: InitialLoginModule.default
    },
    Playlist: {
      screen: PlaylistModule.default
    },
    LocalMusic: {
      screen: LocalMusicModule.default
    },
    ArtistPage: {
      screen: ArtistPageModule.default
    },
    AlbumPage: {
      screen: AlbumPageModule.default
    },
    Msg: {
      screen: MsgModule.default
    },
    MsgHistory: {
      screen: MsgHistoryModule.default
    },
    MusicRecommend: {
      screen: MusicRecommendModule.default
    },
    Radio: {
      screen: RadioModule.default
    },
    RadioDetail: {
      screen: RadioDetailModule.default
    },
    Charts: {
      screen: ChartsModule.default
    },
    HotPlaylist: {
      screen: HotPlaylistModule.default
    },
    Favs: {
      screen: FavsModule.default
    },
    CachePage: {
      screen: CachePageModule.default
    },
    WebViewPage: {
      screen: WebViewPageModule.default
    },
    Tip: {
      screen: TipModule.default
    },
    Cloud: {
      screen: CloudModule.default
    },
    UserManager: {
      screen: UserManagerModule.default
    },
    UserInfo: {
      screen: UserInfoModule.default
    },
    FollowPage: {
      screen: FollowPageModule.default
    },
    LanguagePage: {
      screen: LanguagePageModule.default
    },
    FeaturePage: {
      screen: FeaturePageModule.default
    },
    OrderPage: {
      screen: OrderPageModule.default
    },
    MusicNotificationPage: {
      screen: MusicNotificationPageModule.default
    },
    CommentPage: {
      screen: CommentPageModule.default
    },
    ListenRecord: {
      screen: ListenRecordModule.default
    },
    PlaylistIntersection: {
      screen: PlaylistIntersectionModule.default
    },
    LyricPage: {
      screen: LyricPageModule.default
    },
    HappyBirthday: {
      screen: HappyBirthdayModule.default
    },
    SubNewSongs: {
      screen: SubNewSongsModule.default
    },
    Video: {
      screen: VideoModule.default
    }
  }, {
    headerMode: 'null',
    navigationOptions: {
      gesturesEnabled: false,
      drawerLockMode: 'locked-closed'
    }
  });
exports.default = z;
