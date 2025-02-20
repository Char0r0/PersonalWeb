const webpack = require('webpack');

module.exports = {
    // ... 其他配置
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'raw-loader',
                    }
                ]
            }
        ]
    }
}; 