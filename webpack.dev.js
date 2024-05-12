const path = require("path");
const { merge } = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");

const config = require('./webpack.common.js');

// used for dev mode only
module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './sample/sample.ts',
  output: {
    filename: "sample.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '',
  },
  devServer: {
    contentBase: path.join(__dirname, "_bundles"),
    compress: true,
    port: 8000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: `index.html`, to: "", context: `sample/` },
        { from: `assets/fonts/*.woff`, to: "", context: `src/` },
        { from: `assets/fonts/*.woff2`, to: "", context: `src/` },
      ],
    }),
  ],
});