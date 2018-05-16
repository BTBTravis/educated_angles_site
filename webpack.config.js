const path = require('path');

module.exports = [
  {
    target: 'node',
    entry: {
      server: './src/server.js',
      config: './src/config.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
  },
  {
    target: 'node',
    entry: {
      cockpit: './src/tests/cockpit-test.js',
      signupgenius: './src/tests/signup-genius-test.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist/tests'),
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
  }
];
