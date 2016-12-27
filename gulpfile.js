const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const tinypng = require('gulp-tinypng-nokey');

const isDevelopment = process.env.NODE_ENV !== 'production';


gulp.task('views', function buildHTML() {
    return gulp.src('./src/views/**/*.pug')
        .pipe(pug())
        .on('error', function(error) {
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        })
        .pipe(gulp.dest('./public'));
});

gulp.task('styles', function () {
    return gulp.src('./src/styles/app.styl')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(stylus({
            'include css': true
        })
        .on('error', function(error) {
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        }))
        .pipe(gulpIf(!isDevelopment, postcss([
            autoprefixer({
                browsers: ['> 5%', 'ff > 14']
            })
        ])))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulpIf(!isDevelopment, cleanCSS()))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public'))
});

gulp.task('scripts', function() {
    return browserify({
        entries: './src/scripts/app.js',
        debug: isDevelopment
    })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', function(error) {
            gutil.log(gutil.colors.red('Error: ' + error), '\n', error.codeFrame);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpIf(!isDevelopment, uglify({mangle: false})))
        .pipe(gulp.dest('./public'));
});

gulp.task('fonts', function () {
    return gulp.src([
        './node_modules/font-awesome/fonts/**/*.*'
    ])
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('images', function () {
    return gulp.src('./src/images/*.*')
        .pipe(gulpIf(!isDevelopment, tinypng()))
        .pipe(rename(function (path) {
            path.dirname = '';
        }))
        .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function () {
    gulp.watch('./src/views/**/*.pug', gulp.series('views'));
    gulp.watch('./src/styles/**/*.styl', gulp.series('styles'));
    gulp.watch('./src/scripts/**/*.js', gulp.series('scripts'));
});

gulp.task('serve', function () {
    browserSync.init({
        // proxy: 'example.com',
        // files: 'public/**/*.*',
        server: './public',
        port: 8080,
        middleware: [ historyApiFallback() ]
    });

    browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
    return del('./public')
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel(
        'views',
        'styles',
        'scripts',
        'fonts',
        'images'
    )));

gulp.task('default', gulp.series(
    'build',
    gulp.parallel(
        'watch',
        'serve'
    )));
