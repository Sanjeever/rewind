import * as account from './account';
import * as catalog from './catalog';
import * as tracks from './tracks';
import * as playlists from './playlists';
import * as discovery from './discovery';
import * as comments from './comments';
import * as playlistCategories from './playlistCategories';

const netease = {
  ...account,
  ...catalog,
  ...tracks,
  ...playlists,
  ...discovery,
  ...comments,
  ...playlistCategories,
};
export default netease;
