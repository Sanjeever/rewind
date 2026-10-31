import locales from '../locales/index';
const f = {
  configObject: {
    prev: {
      title: locales.ACTION_PREVIOUS,
      on: true,
    },
    play: {
      title: locales.ACTION_PLAY_PAUSE,
      on: true,
    },
    next: {
      title: locales.ACTION_NEXT,
      on: true,
    },
    stop: {
      title: locales.ACTION_STOP,
      on: true,
    },
    seekbar: {
      title: locales.ACTION_SEEKBAR,
      on: true,
    },
  },
  configKeys: ['prev', 'play', 'next', 'stop', 'seekbar'],
};
export default f;
