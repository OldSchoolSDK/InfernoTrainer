const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

if (!process.env.COMMIT_REF) {
  process.env.COMMIT_REF = "local build"
}
if (!process.env.BUILD_DATE) {
  process.env.BUILD_DATE = "n/a";
}
const content = 'inferno';
module.exports = {
  mode: 'development',
  entry: './src/content/inferno/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: `index.html`, to: "", context: `src/` },
        { from: `assets/fonts/*.woff`, to: "", context: `src/` },
        { from: `assets/fonts/*.woff2`, to: "", context: `src/` },
      ],
    }),
    new webpack.EnvironmentPlugin(['COMMIT_REF', 'BUILD_DATE'])
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg)$/i,
        type: 'asset/resource',
      },
    ]
  }
};