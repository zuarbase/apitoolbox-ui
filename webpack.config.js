const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/apitoolbox-ui.js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 9101
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(s?)css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/dev.html'
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD': "'WEB'" // Vuelidate uses this
        })
    ]
};
