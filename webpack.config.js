const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/main.js'],
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: 'babel-loader?cacheDirectory',
      },
    ]
  }
}