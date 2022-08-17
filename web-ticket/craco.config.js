const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [{
    plugin: CracoLessPlugin,
    options: {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#F56A05',
            // '@menu-item-active-bg': '#065fd4',
          },
          javascriptEnabled: true,
        },
      },
    },
  }, ],
};


