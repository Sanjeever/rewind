import dayjs from 'dayjs';
import type {ConfigType} from 'dayjs';
import languageModule from '../native/language';
import Runtime572 from 'dayjs/plugin/localizedFormat';
import Runtime573 from 'dayjs/locale/en';
import Runtime574 from 'dayjs/locale/zh-cn';
const i: Record<string, typeof Runtime574> = {
  zh_CN: Runtime574,
  zh_TW: Runtime574,
  zh_HK: Runtime574,
  en_US: Runtime573,
};
dayjs.extend(Runtime572);
dayjs.locale(i[languageModule.language]);
const useDate = function (e: number | string | Date) {
  const t = new Date(e);
  return {
    year: t.getFullYear(),
    month: t.getMonth() + 1,
    day: t.getDate(),
  };
};
const g = {
  parseTime: function (e?: number | null) {
    if (!e) {
      return '0:00';
    }
    const t = Math.floor(e / 60);
    const a = Math.floor(e - 60 * t);
    return `${t}:${a < 10 ? `0${a}` : a}`;
  },
  isToday: function (e: number | string | Date) {
    const t = useDate(e);
    const {month, day} = t;
    const n = useDate(Date.now());
    const {month: month_1, day: day_1} = n;
    return month == month_1 && day == day_1;
  },
  useDate,
  diffInDays: function (e: Date, t: Date) {
    const a = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
    const r = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.floor((r - a) / 86400000);
  },
  isSameDay: function (e: ConfigType, t: ConfigType) {
    return dayjs(e).isSame(dayjs(t), 'day');
  },
  localeString: function (e: ConfigType) {
    let t = 'dddd, MMM D';
    if (!dayjs(e).isSame(Date.now(), 'year')) {
      t += ', YYYY';
    }
    return dayjs(e).format(t);
  },
};
export default g;
