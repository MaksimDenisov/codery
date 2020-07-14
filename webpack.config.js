var webpack = require('webpack');

var config = {
    mode: "development",
    context: __dirname, // `__dirname` is root of project and `/src` is source
    entry: {
        app: './static/app.jsx',
    },
    output: {
        path: __dirname + '/public', // `/dist` is the destination
        filename: 'bundle.js', // bundle created by webpack it will contain all our app logic. we will link to this .js file from our html page.
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
};

module.exports = config;