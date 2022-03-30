const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

let isDevBuild = false;
if (!process.env.COMMIT_REF) {
  isDevBuild = true;
  process.env.COMMIT_REF = "local build"
}
if (!process.env.BUILD_DATE) {
  isDevBuild = true;
  process.env.BUILD_DATE = "";
}
const config = {
  mode: isDevBuild ? 'development' : 'production',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: `index.html`, to: "", context: `src/` },
        { from: `manifest.json`, to: "", context: `src/` },
        { from: `assets/images/webappicon.png`, to: "webappicon.png", context: `src/` },
        { from: `assets/fonts/*.woff`, to: "", context: `src/` },
        { from: `assets/fonts/*.woff2`, to: "", context: `src/` },
      ],
    }),
    new webpack.EnvironmentPlugin(['COMMIT_REF', 'BUILD_DATE'])
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg)$/i,
        type: 'asset/resource',
      },
    ]
  }
};

if (isDevBuild) {
  config.devtool = 'eval';
}
module.exports = config;