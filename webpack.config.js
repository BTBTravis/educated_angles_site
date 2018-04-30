const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/bin/www',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ea.bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
