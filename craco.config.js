const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /\.md$/,
                        use: [
                            {
                                loader: 'raw-loader'
                            }
                        ]
                    }
                ]
            },
            resolve: {
                fallback: {
                    "path": require.resolve("path-browserify"),
                    "fs": false,
                    "buffer": require.resolve("buffer/")
                }
            }
        },
        plugins: {
            add: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser'
                })
            ]
        }
    }
}; 