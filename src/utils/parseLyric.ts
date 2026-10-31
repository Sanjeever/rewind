import {Lrc} from 'lrc-kit';
export interface LyricLine {
  min: number;
  sec: number;
  ms: number;
  txt: string;
  dis: boolean;
  total: number;
  trans?: LyricLine;
}
export interface LyricRow {
  txt: string;
  total?: number;
  trans?: LyricRow;
}
export default (function parseLyric(text: string): LyricLine[] {
  return Lrc.parse(text)
    .lyrics.filter((line) => line.content.trim().length > 0)
    .sort((left, right) => left.timestamp - right.timestamp)
    .map(({timestamp, content}) => ({
      min: Math.floor(timestamp / 60),
      sec: Math.floor(timestamp % 60),
      ms: Math.round((timestamp - Math.floor(timestamp)) * 1000),
      txt: content.trim(),
      dis: false,
      total: timestamp,
    }));
});
