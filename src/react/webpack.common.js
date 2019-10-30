var webpack = require('webpack');
var path = require('path');
var RemovePlugin = require('remove-files-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        main: path.join(__dirname, 'boot.tsx'),
    },
    output: {
        path: path.join(__dirname, '../Ranger.Spa/wwwroot'),
        filename: '[name].[hash].js',
        publicPath: '/',
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.NamedModulesPlugin(),
        new RemovePlugin({
            before: {
                test: [
                    {
                        folder: 'src/Ranger.Spa/wwwroot',
                        method: filePath => {
                            return new RegExp(/main.*.[js|gz]$/, 'm').test(filePath);
                        },
                    },
                    {
                        folder: 'src/Ranger.Spa/wwwroot',
                        method: filePath => {
                            return new RegExp(/index.html$/, 'm').test(filePath);
                        },
                    },
                    {
                        folder: 'src/Ranger.Spa/wwwroot',
                        method: filePath => {
                            return new RegExp(/\.(jpg|svg)$/, 'm').test(filePath);
                        },
                    },
                ],
                log: true,
            },
        }),
    ],
    stats: {
        colors: true,
        errorDetails: true,
    },
};
