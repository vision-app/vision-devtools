module.exports = {
    webpack: {
        entry: {
            devtools: './devtools/index.js',
        },
    },
    webpackDevServer: {
        contentBase: __dirname,
        publicPath: '/build/',
    },
};
