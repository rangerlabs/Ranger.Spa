var webpack = require("webpack");
var merge = require("webpack-merge");
var common = require("./webpack.common.js");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.ejs"),
            inject: true,
        }),
        new webpack.DefinePlugin({
            IDENTITY_AUTHORITY: JSON.stringify("localhost.io:5000"),
            PUSHER_AUTHENDPOINT: JSON.stringify("localhost.io:5000/auth/pusher"),
            API_HOST: JSON.stringify("localhost.io:8081"),
            SPA_HOST: JSON.stringify("localhost.io:8080"),
            BASE_PATH: JSON.stringify(""),
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css"],
        alias: {
            "react-dom": "@hot-loader/react-dom",
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
                use: ["babel-loader", "react-hot-loader/webpack", "ts-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babelLoader",
            },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            {
                test: /\.svg$/,
                use: "react-svg-loader",
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf)$/,
                use: "url-loader?limit=100000",
            },
        ],
    },
});
