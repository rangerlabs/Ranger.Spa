var webpack = require('webpack');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
var CompressionPlugin = require('compression-webpack-plugin');
var HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var smp = new SpeedMeasurePlugin();

module.exports = merge(common, {
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.ejs'),
            inject: true,
            jsExtension: '.gz',
        }),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js(\?.*)?$/i,
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: true,
        }),
        new webpack.DefinePlugin({
            IDENTITY_AUTHORITY: JSON.stringify('rangerlabs.io/auth'),
            PUSHER_AUTHENDPOINT: JSON.stringify('rangerlabs.io/api/pusher/auth'),
            PUSHER_KEY: JSON.stringify('0446e961be4e192bd342'),
            API_HOST: JSON.stringify('rangerlabs.io'),
            SPA_HOST: JSON.stringify('rangerlabs.io'),
            BASE_PATH: JSON.stringify('/api'),
            GOOGLE_MAPS_KEY: JSON.stringify('AIzaSyBs_XgfpRN4B8Af7UjoJhSvj5BtR71Zv6U'),
        }),
        new HtmlWebpackChangeAssetsExtensionPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babelLoader',
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.svg$/,
                use: 'react-svg-loader',
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf)$/,
                use: 'url-loader?limit=100000',
            },
        ],
    },
});
