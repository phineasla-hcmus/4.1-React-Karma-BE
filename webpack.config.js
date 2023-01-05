const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = (config) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.node$/,
          use: ['node-loader'],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'secret' }],
      }),
    ],
  });
};
