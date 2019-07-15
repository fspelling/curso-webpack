const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');

let plugins = [
    new htmlPlugin({
        hash: true,
        minify: {
            html5: true,
            collapseWhitespace: true,
            removeComments: true
        },
        filename: 'index.html',
        template: __dirname + '/main.html'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new extractTextPlugin('styles.css'),
    new webpack.ProvidePlugin({
        $: 'jquery/dist/jquery.js',
        jQuery: 'jquery/dist/jquery.js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js'
    })
];

let SERVICE_URL = JSON.stringify('http//localhost:3000');

if (process.env.NODE_ENV === 'production') {
    SERVICE_URL = JSON.stringify('http//api.prod');

    plugins.push(new babiliPlugin());

    plugins.push(new optimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        canPrint: true,
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        }
    }));
}

plugins.push(new webpack.DefinePlugin({ SERVICE_URL }));

module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins
};