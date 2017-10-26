
const webpack = require( 'webpack' ),
    plugins = [

      // public reqire( xxx )
      new webpack.ProvidePlugin({
        React    : 'react',
        ReactDOM : 'react-dom',
        Notify   : 'notify',
      }),

      // chunk files
      new webpack.optimize.CommonsChunkPlugin({
        names     : [ 'vendors', 'emoji_popup', 'emoji_contentscripts', 'common' ],
        minChunks : Infinity
      }),

      // defined environment variable
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify( 'production' ) // or development
      }),

    ],

    // conditions environment
    isProduction = function () {
      return process.env.NODE_ENV === 'production';
    },

    // only when environment variable is 'production' call
    deploy = ( function () {
      var CopyWebpackPlugin  = require( 'copy-webpack-plugin'  ),
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

        // copy files
        plugins.push(
          new CopyWebpackPlugin([
            { from   : "src/manifest.json" ,             to : '../' },

            { from   : 'src/options/options.html',       to : '../options/' },
            { from   : 'src/options/options.css',        to : '../options/' },

            { from   : 'src/popup/popup.html',           to : '../popup/' },
            { from   : 'src/popup/popup.css',            to : '../popup/' },

            { context: 'src/assets/',     from : "*/*" , to : '../assets/' },
            { context: 'src/_locales/',   from : "*/*" , to : '../_locales/' },
          ])
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
              comments: false,
              ascii_only: true
            }
          })
        );

      }
    })(),

    // webpack config
    config = {
      entry: {

        common : [
          'jquery',
        ],

        // with popup
        emoji_popup : [
          'chardict',
          'categories',
        ],

        // with contentscripts
        emoji_contentscripts : [
          'zh_emoji',
          'emoji_insert',
        ],

        // with options
        vendors : [

          // react
          './node_modules/react/dist/react.min.js',
          './node_modules/react-dom/dist/react-dom.min.js',

          // vendors
          'velocity',
          'notify',

          // mduikit
          'tooltip',
          'waves',
          'textfield',
          'button',
          'selectfield',
        ],

        contentscripts : './src/contentscripts.js',
        background     : './src/background.js',
        options        : './src/options/options.js',
        popup          : './src/popup/popup.js',
      },

      output: {
        path     :  isProduction() ? './publish/bundle' : './src/bundle',
        filename : '[name].js'
      },

      plugins: plugins,

      module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: [ 'es2015', 'stage-0', 'react' ]
            }
        },
        { test: /\.css$/,           loader: 'style!css!postcss' },
        { test: /\.(png|jpg|gif)$/, loader: 'url?limit=12288'   },
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

          option     : __dirname + '/src/options/options.js',

          chardict   : __dirname + '/src/vender/emoji/chardict.js',
          categories : __dirname + '/src/vender/emoji/categories.js',
          zh_emoji   : __dirname + '/src/vender/emoji/zh_emoji.js',
          emoji_insert : __dirname + '/src/vender/emoji/emoji_insert.js',

          jquery     : __dirname + '/src/vender/jquery-2.1.1.min.js',
          velocity   : __dirname + '/src/vender/velocity.min.js',
          wavess     : __dirname + '/src/vender/waves/waves.js',
          notify     : __dirname + '/src/vender/notify/notify.js',
          tooltip    : __dirname + '/src/vender/mduikit/tooltip.jsx',
          waves      : __dirname + '/src/vender/mduikit/waves.js',

          textfield  : __dirname + '/src/vender/mduikit/textfield.jsx',
          fab        : __dirname + '/src/vender/mduikit/fab.jsx',
          button     : __dirname + '/src/vender/mduikit/button.jsx',
          selectfield: __dirname + '/src/vender/mduikit/selectfield.jsx',
          switch     : __dirname + '/src/vender/mduikit/switch.jsx',
          tabs       : __dirname + '/src/vender/mduikit/tabs.jsx',
          progress   : __dirname + '/src/vender/mduikit/progress.jsx',
          sidebar    : __dirname + '/src/vender/mduikit/sidebar.jsx',
          list       : __dirname + '/src/vender/mduikit/list.jsx',
          dialog     : __dirname + '/src/vender/mduikit/dialog.jsx',

        }
      }

};

module.exports = config;
