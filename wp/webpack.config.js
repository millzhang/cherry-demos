const path = require('path');

// 将js中的文件提取到单独的文件中,webpack4.0被mini-css-extract-plugin取代，
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    compress: true
  },
  // webpack只认识js,其他文件需要加loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: `[name]_[contenthash:2].css`,
      // chunkFilename: `[id].css`
    })
  ]
};
