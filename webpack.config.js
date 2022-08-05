const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./web/app/index.js'],
  output: {
    path: path.resolve(__dirname, 'server', 'public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        resolve: { extensions: ['.js'] },
        use: { loader: 'babel-loader' },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ title: 'PWA', template: './web/index.html' })],
};
