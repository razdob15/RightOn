const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`

  // Handle .node files for native dependencies
  config.resolve.fallback = {
    ...config.resolve.fallback,
  };

  return config;
});
