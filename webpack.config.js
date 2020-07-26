const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");


var config = {
    context: __dirname,
    entry: {
        app: './static/app.jsx',
    },
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-react"]
                    }
                }
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: `static`, to: `` },
        ]),
    ],
};

module.exports = config;