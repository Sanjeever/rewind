import type {LyricRow} from '../utils/parseLyric';

export function getLyricIndex(lines: readonly LyricRow[] | null, seconds: number) {
  if (!lines?.length) return null;
  if (lines[0].total != null && seconds < lines[0].total) return 0;
  let selected: number | null = null;
  for (let index = 0; index < lines.length; index++) {
    const total = lines[index].total;
    if (total != null && Number.isFinite(total) && seconds + 0.3 >= total) selected = index;
  }
  return selected;
}

export function getMiniLyric(
  lines: readonly LyricRow[] | null,
  seconds: number,
  showTranslation: boolean,
) {
  const index = getLyricIndex(lines, seconds + 0.2);
  const line = index == null ? undefined : lines?.[index];
  if (!line || /词|曲|音|：|:/.test(line.txt)) return;
  return showTranslation && line.trans ? line.trans.txt + ' / ' + line.txt : line.txt;
}
