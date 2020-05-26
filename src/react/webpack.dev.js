var webpack = require('webpack');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var smp = new SpeedMeasurePlugin();

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.ejs'),
            inject: true,
        }),
        new webpack.DefinePlugin({
            PUSHER_KEY: JSON.stringify('aed7ba7c7247aca9680e'),
            GOOGLE_MAPS_KEY: JSON.stringify('AIzaSyCFnqUWfag20Li24AXGUEQigqK8y-Fhakk'),
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    devServer: {
        historyApiFallback: true,
    },
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
