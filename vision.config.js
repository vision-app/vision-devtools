module.exports = {
    webpack: {
        entry: {
            devtools: './src/devtools/index.js',
            backend: './src/backend/index.js',
        },
    },
    webpackDevServer: {
        contentBase: __dirname,
        publicPath: '/build/',
    },
};
