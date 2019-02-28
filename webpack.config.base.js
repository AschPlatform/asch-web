const path = require('path')
const {
  CheckerPlugin
} = require('awesome-typescript-loader')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const libName = 'asch-web'

let baseConfig = {
  mode: 'development',
  // mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libName,
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
  },

  devtool: 'inline-source-map',
  resolve: {
    // mainFields: ['browser', 'module', 'main'],
    // modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader'
    }]
  },
  plugins: [
    new CheckerPlugin()
  ]
}

let targets = ['web', 'node', 'async-node'].map((target) => {
  
  let config = webpackMerge(baseConfig, {
    target: target,
    output: {
      filename: libName + '.' + target,
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs',
    }
  })
  return config
})

module.exports = targets