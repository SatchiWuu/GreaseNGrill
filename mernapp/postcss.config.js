module.exports = {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['last 2 versions'],
            grid: true,
        }),
        // This will suppress warnings for deprecated properties
        require('postcss-replace')({
            rules: [
                {
                    match: /color-adjust/g,
                    replacement: 'print-color-adjust',
                },
            ],
        }),
    ],
};