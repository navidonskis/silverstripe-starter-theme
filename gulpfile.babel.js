'use strict';

import {join, normalize} from 'path';
import gulp from 'gulp';
import sourceMaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import browserify from 'gulp-browserify';
import babelify from 'babelify';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import svgSprite from 'gulp-svg-sprite';
import svg2png from 'gulp-svg2png';
import {CONFIG} from './babel/config/config';
import {SOURCE} from './babel/config/source';

export const ROOT_DIR = normalize(join(__dirname));
export const SVG_CONFIG = {
    mode: {
        css: {
            sprite: `../${CONFIG.DIR.IMG}/${CONFIG.SVG.SPRITE_NAME}`,
            render: {
                scss: {
                    dest: `${CONFIG.DIR.CSS_CORE}/_${CONFIG.SVG.SPRITE_NAME.replace(/\.svg/, '.scss')}`
                }
            },
            bust: false
        }
    }
};
export function javascript(source = [], output = '') {
    if (output == '' || source.length <= 0) return false;

    return gulp.src(source)
        .pipe(sourceMaps.init())
        .pipe(browserify({
            transform: ["babelify"],
            entries: source.map(item => {
                return join(ROOT_DIR, item);
            }),
            paths: [
                join(ROOT_DIR, 'node_modules'),
                join(ROOT_DIR, CONFIG.DIR.SRC)
            ]
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(output))
        .pipe(uglify())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(`${CONFIG.DIR.DIST}/${CONFIG.DIR.JS}`))
        .pipe(browserSync.reload({stream: true}));
};
export function styles() {
    return gulp.src(`${CONFIG.DIR.SRC}/${CONFIG.DIR.CSS}/**/*.{sass,scss}`)
        .pipe(
            sass({
                outputStyle: CONFIG.STYLES.output
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer(CONFIG.STYLES.BROWSERS))
        .pipe(gulp.dest(`${CONFIG.DIR.DIST}/${CONFIG.DIR.CSS}`))
        .pipe(browserSync.reload({stream: true}));
};
export function images() {
    return gulp.src(`${CONFIG.DIR.SRC}/${CONFIG.DIR.IMG}/**/*.*`)
        .pipe(gulp.dest(`${CONFIG.DIR.DIST}/${CONFIG.DIR.IMG}`))
        .pipe(browserSync.reload({stream: true}));
};

gulp.task('browser-sync', () =>
    browserSync({
        proxy: {
            target: "http://hostname.app",
        }
        // server: {
        //     baseDir: join(ROOT_DIR, CONFIG.DIR.DIST)
        // }
    })
);

// main app of the project
gulp.task('javascript', () => javascript([CONFIG.OUTPUT.JS].map(item => {
    return join(CONFIG.DIR.SRC, CONFIG.DIR.JS, item);
}), CONFIG.OUTPUT.JS))
// extra javascript bundles (libraries, third-parties)
gulp.task('bundle', () => javascript(SOURCE.map(item => {
    return join(CONFIG.DIR.SRC, CONFIG.DIR.BUNDLE, item);
}), CONFIG.OUTPUT.JS_BUNDLE));

// styles of the project (sass,scss)
gulp.task('styles', () => styles());

gulp.task('images', () => images());

gulp.task('svg', () => {
    return gulp.src(`${CONFIG.DIR.SRC}/${CONFIG.DIR.SVG}/*.svg`)
        .pipe(svgSprite(SVG_CONFIG))
        .pipe(gulp.dest(CONFIG.DIR.SRC));
});

gulp.task('svg2png', ['svg'], () => {
    return gulp.src(`${CONFIG.DIR.SRC}/${CONFIG.DIR.IMG}/${CONFIG.SVG.SPRITE_NAME}`)
        .pipe(svg2png())
        .pipe(gulp.dest(`${CONFIG.DIR.SRC}/${CONFIG.DIR.IMG}`));
});

gulp.task('sprite', ['svg2png']);

gulp.task('templates', () => {
    return gulp.src(`${CONFIG.DIR.TEMPLATE}/**/*.ss`)
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['sprite', 'javascript', 'bundle', 'styles', 'images']);

gulp.task('watch', ['sprite', 'javascript', 'bundle', 'styles', 'images', 'browser-sync'], () => {
    gulp.watch(`${CONFIG.DIR.SRC}/${CONFIG.DIR.JS}/**/*.js`, ['javascript']);
    gulp.watch(`${CONFIG.DIR.SRC}/${CONFIG.DIR.BUNDLE}/**/*.js`, ['bundle']);
    gulp.watch(`${CONFIG.DIR.SRC}/${CONFIG.DIR.CSS}/**/*.{sass,scss}`, ['styles']);
    gulp.watch(`${CONFIG.DIR.SRC}/${CONFIG.DIR.IMG}/**/*.*`, ['images']);
    gulp.watch(`${CONFIG.DIR.TEMPLATE}/**/*.ss`, ['templates']);
});