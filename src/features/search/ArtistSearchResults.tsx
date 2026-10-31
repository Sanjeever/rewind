import EntitySearchResults from './EntitySearchResults';
import type {EntitySearchProps} from './EntitySearchResults';
export default function ArtistSearchResults(props: EntitySearchProps) {
  return <EntitySearchResults {...props} kind="singers" />;
}
