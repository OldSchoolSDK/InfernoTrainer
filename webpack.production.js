const path = require("path");
const { merge } = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");

const config = require('./webpack.common.js');

// used for production builds
module.exports = merge(config, {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    library: {
      name: 'OldSchoolSDK',
      type: 'umd',
    },
    umdNamedDefine: true,
    path: path.resolve(__dirname, "_bundles"),
    publicPath: '', // workaround: https://github.com/cypress-io/cypress/issues/18435
  },
  optimization: {
    minimize: false
  },
  externals: {
    three: 'three'
  }
});
