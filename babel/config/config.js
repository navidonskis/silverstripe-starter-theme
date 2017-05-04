export const CONFIG = {
    DIR: {
        SRC: 'src',
        DIST: 'assets',
        JS: 'js',
        CSS: 'css',
        IMG: 'img',
        FONTS: 'fonts',
        TEMPLATE: 'templates',
        SVG: 'svg',
        BUNDLE: 'lib',
        CSS_CORE: 'core'
    },
    OUTPUT: {
        JS: 'app.js',
        JS_BUNDLE: 'bundle.js',
        SASS: 'app.scss'
    },
    STYLES: {
        BROWSERS: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ],
        output: 'compressed'
    },
    SVG: {
        SPRITE_NAME: 'sprite.svg'
    }
};