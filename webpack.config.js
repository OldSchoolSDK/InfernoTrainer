const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const config = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    library: 'OldSchoolSDK',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, "_bundles"),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: `assets/fonts/*.woff`, to: "", context: `src/` },
        { from: `assets/fonts/*.woff2`, to: "", context: `src/` },
      ],
    }),
  ],
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

module.exports = config;
