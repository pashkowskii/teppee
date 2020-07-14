module.exports = {
  test: /\.(js|jsx)?(\.erb)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets:['teppee', 'stage-2']
  }
}
