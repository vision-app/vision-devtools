module.exports = {
    webpack: {
        entry: {
            devtools: './src/devtools/index.js',
            backend: './src/backend/index.js',
        },
        resolve: {
            REMAIN: true,
            alias: {
                REMAIN: true,
                src: __dirname + '/src',
            },
        },
    },
    webpackDevServer: {
        contentBase: __dirname,
        publicPath: '/build/',
    },
};
