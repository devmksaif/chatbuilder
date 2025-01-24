const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust as necessary
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  devServer: {
    hot: true,
    overlay: {
      runtimeErrors: (error) => {
        if (error.message.includes("ResizeObserver loop completed with undelivered notifications")) {
          return false;  // Suppress the specific error
        }
        return true;  // Allow all other runtime errors
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Adjust the path as necessary
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx','.tsx'],
  },
};
