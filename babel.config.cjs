module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { safari: '9' }, modules: 'commonjs' }],
    ['@babel/preset-react', { runtime: 'classic' }],
  ],
};
