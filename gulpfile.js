const gulp = require('gulp');
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
const bro = require('gulp-bro');
const babelify = require('babelify');
const uglify = require('gulp-uglify');

const isDevelopment = process.env.NODE_ENV !== 'production';


gulp.task('views', function buildHTML() {
  return gulp.src('./src/**/*.pug')
    .pipe(pug())
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    })
    .pipe(rename(path => {
      if (path.dirname !== '.') path.dirname = ('views/' + path.dirname);
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('styles', function () {
  return gulp.src('./src/app.styl')
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
    .pipe(gulp.dest('./public/css'))
});

gulp.task('scripts', function () {
  return gulp.src('./src/app.js')
    .pipe(bro({
      debug: isDevelopment,
      transform: [
        babelify.configure({ presets: ['es2015'] }),
      ]
    }))
    .pipe(gulpIf(!isDevelopment, uglify({ mangle: false })))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.pug', gulp.series('views'));
  gulp.watch('./src/**/*.{css,styl}', gulp.series('styles'));
  gulp.watch('./src/**/*.js', gulp.series('scripts'));
});

gulp.task('serve', function () {
  browserSync.init({
    // proxy: 'example.com',
    // files: 'public/**/*.*',
    server: './public',
    port: 8080,
    middleware: [historyApiFallback({
      logger: gutil.log
    })]
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
    'scripts'
  )));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  )));
