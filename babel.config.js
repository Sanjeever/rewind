export default function (api) {
  const esm = api.caller((caller) => caller?.supportsStaticESM === true);
  return {
    presets: [['module:@react-native/babel-preset', {disableImportExportTransform: esm}]],
  };
}
