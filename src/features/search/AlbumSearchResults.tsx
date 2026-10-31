import EntitySearchResults from './EntitySearchResults';
import type {EntitySearchProps} from './EntitySearchResults';
export default function AlbumSearchResults(props: EntitySearchProps) {
  return <EntitySearchResults {...props} kind="albums" />;
}
