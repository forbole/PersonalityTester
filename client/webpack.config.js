const path = require('path');

module.exports = {
    // entry: ['./callback/clicks.js',
    //         './callback/client.js',
    //         ],
    output: {
        filename: 'dist/index.bundle.js',
        path: path.resolve(__dirname, './'),
    }
};
