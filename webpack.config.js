"use strict";

const path = require('path');

module.exports = {
    context: __dirname + "/client",
    entry: "./main.js",
    output: {

        filename: "./build/app.bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
             test: /\.jsx?$/,
             loader: 'babel',
             query: {
             presets: ['react', 'es2015']
             }
            }
        ]
    }
}
