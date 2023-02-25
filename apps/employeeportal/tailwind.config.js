const { join } = require('path');

// TODO: use this function to automatically determine the libs this depends on
// available since Nx v 12.5
// const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');

module.exports = {
    mode: 'jit',
    purge: {
        enable: true,
        content: [
            join(__dirname, 'src/**/*.html'),
            // TODO: do not specify all libs unless this app really depends on all libs.
            './libs/**/*.html'
            // ...createGlobPatternsForDependencies('C:\\Development\\sites\\intra\\angularworkpsace\\apps\\employeeportal','src/**/*.html')
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}