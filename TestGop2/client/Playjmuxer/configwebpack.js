const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js' //  將 index.js 指定為入口網站
  ],
  output: {
    path: path.resolve(process.cwd(), 'build') // 將產出放在 build 上
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: `./src/index.html`,
    })
  ],
}