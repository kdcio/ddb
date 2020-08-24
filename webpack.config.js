// Import path for resolving file paths
const path = require('path');

module.exports = {
  // Specify the entry point for our app
  entry: './src/index.js',

  // Specify the output file containing our bundled code
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ddb.js',
    library: 'DDB',
    libraryTarget: 'umd',
  },
  // Let webpack know to generate a Node.js bundle
  target: 'node',
  mode: 'production',
};
