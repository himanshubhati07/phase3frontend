const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Force JSC for the web bundle (Hermes is native-only).
config.server.rewriteRequestUrl = (url) => {
  if (url.includes('platform=web')) {
    return url.replace('transform.engine=hermes', 'transform.engine=jsc');
  }
  return url;
};

module.exports = config;
