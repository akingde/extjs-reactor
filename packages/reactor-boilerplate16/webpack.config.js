const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtReactWebpackPlugin = require('@extjs/reactor-webpack-plugin')
const portfinder = require('portfinder')
const sourcePath = path.join(__dirname, './src');

module.exports = function (env) {
  portfinder.basePort = (env && env.port) || 8080; // the default port to use
  return portfinder.getPortPromise().then(port => {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production'
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true
      }), 
      new ExtReactWebpackPlugin({
        port: port,
//        sdk: 'ext', // you need to copy the Ext JS SDK to the root of this package, or you can specify a full path to some other location
        //theme: 'custom-ext-react-theme',
        overrides: ['ext-react/overrides'],
        production: isProd
      })
    ]
    return {
      mode: 'development',
      devtool: isProd ? 'source-map' : 'cheap-module-source-map',
      context: sourcePath,
      entry: {
        //vendor: ['react', 'react-dom', 'react-hot-loader/patch', '@extjs/reactor16'],
        reactor16: ['@extjs/reactor16'],
        'app': [
          'babel-polyfill',
          './index.js'
        ]
      },
      output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              'babel-loader'
            ]
          }
        ]
      },

      resolve: {
        // The following is only needed when running this boilerplate within the extjs-reactor repo.  You can remove this from your own projects.
        alias: {
          "react-dom": path.resolve('./node_modules/react-dom'),
          "react": path.resolve('./node_modules/react')
        }
      },
      plugins,
      devServer: {
        contentBase: './build',
        historyApiFallback: true,
        hot: false,
        host: '0.0.0.0',
        port: port,
        disableHostCheck: false,
        compress: isProd,
        inline: !isProd,
        stats: {
          assets: false,
          children: false,
          chunks: false,
          hash: false,
          modules: false,
          publicPath: false,
          timings: false,
          version: false,
          warnings: false,
          colors: {
            green: '\u001b[32m'
          }
        }
      }
    }
  })
}