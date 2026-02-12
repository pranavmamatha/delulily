module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // NOTE: react-native-reanimated/plugin MUST be listed last
      // In Reanimated 4.x, this plugin already handles worklets internally
      "react-native-reanimated/plugin",
    ],
  };
};
