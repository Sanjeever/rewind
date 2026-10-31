import EntitySearchResults from './EntitySearchResults';
import type {EntitySearchProps} from './EntitySearchResults';
export default function VideoSearchResults(props: EntitySearchProps) {
  return <EntitySearchResults {...props} kind="mvs" />;
}
