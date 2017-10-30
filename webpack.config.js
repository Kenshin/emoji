const ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
      HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
      CopyWebpackPlugin = require( 'copy-webpack-plugin'  ),
      webpack           = require( 'webpack' ),
      plugins           = [

      // omit import xxx
      new webpack.ProvidePlugin({
        jQuery   : 'jquery',
      }),

      // chunk files
      new webpack.optimize.CommonsChunkPlugin({
        names     : [ 'vendors' ],
        minChunks : Infinity
      }),

      // defined environment variable
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify( 'production' ) // or development
      }),

      // extract css files
      new ExtractTextPlugin( '[name].css' ),

      // minify html files
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        inject: false,
        minify: {
          collapseWhitespace: true,
        },
      }),

      // copy files
      new CopyWebpackPlugin([
        { context: 'src/assets/images/',  from : '*' , to : './assets/images'  },
        { context: 'src/assets/favicon/', from : '*' , to : './assets/favicon' },
      ])

    ],

    // conditions environment
    isProduction = function () {
      return process.env.NODE_ENV === 'production';
    },

    // only when environment variable is 'development' call
    develop = ( function () {
      const OpenBrowserPlugin  = require('open-browser-webpack-plugin');
      if ( !isProduction() ) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new OpenBrowserPlugin({ url: 'http://localhost:8080' })
        );
      }
    })(),

    // only when environment variable is 'production' call
    deploy = ( function () {
      const CopyWebpackPlugin  = require( 'copy-webpack-plugin'  ),
            CleanWebpackPlugin = require( 'clean-webpack-plugin' );

      // environment verify
      if ( isProduction() ) {

        // delete publish folder
        plugins.push(
          new CleanWebpackPlugin([ 'publish' ], {
            verbose: true,
            dry    : false,
          })
        );

        // call uglifyjs plugin
        plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              sequences: true,
              dead_code: true,
              conditionals: true,
              booleans: true,
              unused: true,
              if_return: true,
              join_vars: true,
              drop_console: true
            },
            mangle: {
              except: [ '$', 'exports', 'require' ]
            },
            output: {
              comments: false
            }
          })
        );

      }
    })(),

    bundle = ( function () {
      const files = [
        './src/index.js'
      ];
      if ( !isProduction() ) {
        files.push(
          'webpack/hot/dev-server',
          'webpack-dev-server/client?http://localhost:8080'
        );
      }
      return files;
    }),

    // webpack config
    config = {
      entry: {

        vendors : [
          'jquery',
          'fullpage'
        ],

        bundle: bundle(),

      },

      output: {
        path     :  isProduction() ? './publish/' : './',
        filename : '[name].js'
      },

      devServer: {
        contentBase: './src',
        port: 8080,
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
      },

      plugins: plugins,

      module: {
        loaders: [
          {
              test: /\.js?$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                presets: [ 'es2015' ]
              }
          },

          // css in js
          //{ test: /\.css$/,         loader: 'style!css!postcss' },

          // extract css files
          { test: /\.css$/,           loader: ExtractTextPlugin.extract( 'style', 'css!postcss' ) },

          // image in js
          { test: /\.(png|jpg|gif)$/, loader: 'url?limit=12288'   },

          // expose $
          {
            test  : require.resolve( './src/vender/jquery-2.1.1.min.js' ),
            loader: 'expose?jQuery!expose?$'
          },

        ]
      },

      postcss: function () {
        return [
          require( 'import-postcss'  )(),
          require( 'postcss-cssnext' )(),
          require( 'autoprefixer'    )({
            browsers: [ 'last 5 versions', '> 5%' ]
          })
        ]
      },

      resolve: {
        alias : {
            jquery     : __dirname + '/src/vender/jquery-2.1.1.min.js',
            fullpage   : __dirname + '/src/vender/fullpage/jquery.fullpage.min.js',
        }
      }

};

module.exports = config;
