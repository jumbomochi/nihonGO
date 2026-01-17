const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

// Redirect problematic packages to web stubs
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (platform === 'web') {
      // Block dev tools that use import.meta which breaks web builds
      if (
        moduleName.includes('@react-native/debugger-frontend') ||
        moduleName.includes('@react-native/dev-middleware') ||
        moduleName.includes('react-devtools')
      ) {
        return { type: 'empty' };
      }
      // Use web stub for Slider
      if (moduleName === '@react-native-community/slider') {
        return {
          filePath: path.resolve(__dirname, 'components/audio/Slider.web.tsx'),
          type: 'sourceFile',
        };
      }
      // Force zustand to use CJS version on web (ESM version uses import.meta.env)
      if (moduleName === 'zustand') {
        return {
          filePath: path.resolve(__dirname, 'node_modules/zustand/index.js'),
          type: 'sourceFile',
        };
      }
      if (moduleName === 'zustand/middleware') {
        return {
          filePath: path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
          type: 'sourceFile',
        };
      }
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
