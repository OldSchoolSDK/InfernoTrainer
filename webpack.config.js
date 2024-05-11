const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
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
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimize: false
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg|gltf|glb)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
};
