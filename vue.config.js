const vueConfig = {
  "transpileDependencies": [
    "vuetify"
  ],
  "pwa": {
		"workboxOptions": {
      "importWorkboxFrom": 'local',
      "skipWaiting": true,
      "clientsClaim": true,
		}
	}
}

if (process.env.NODE_ENV === 'production') {
  vueConfig.chainWebpack = (config) => {
    config.plugin('html').init((Plugin, args) => {
      const newArgs = {
        ...args[0],
      };
      newArgs.minify.removeAttributeQuotes = false;
      return new Plugin(newArgs);
    });
  };
}

module.exports = vueConfig;