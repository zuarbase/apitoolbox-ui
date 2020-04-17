const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/main.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
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
                test: /\.scss$/,
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
            template: 'src/index.html'
        })
    ]
};
