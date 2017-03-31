module.exports = {
    babel: false,
    webpack: {
        entry: {
            devtools: './src/devtools/index.js',
            backend: './src/backend/index.js',
        },
        resolve: {
            REST_PROPS: true,
            alias: {
                REST_PROPS: true,
                src: __dirname + '/src',
            },
        },
    },
    webpackDevServer: {
        contentBase: __dirname,
        publicPath: '/build/',
    },
};
