const path = require('path');

module.exports = {
  entry: './src/editor.js',
  output: {
    path: path.resolve(__dirname, 'public/javascripts/'),
    filename: 'editor.bundle.js'
  }
};
