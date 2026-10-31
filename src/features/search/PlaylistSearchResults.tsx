import EntitySearchResults from './EntitySearchResults';
import type {EntitySearchProps} from './EntitySearchResults';
export default function PlaylistSearchResults(props: EntitySearchProps) {
  return <EntitySearchResults {...props} kind="playlists" />;
}
