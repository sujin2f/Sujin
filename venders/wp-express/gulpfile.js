const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const colors = require('ansi-colors');
const log = require('fancy-log');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const gzip = require('gulp-gzip');
const del = require('del');

const paths = {
  styles: {
    src: './assets/styles/sass/**/*.scss',
    dest: './assets/dist/css',
  },
  scripts: {
    src: './assets/scripts/**/*.js',
    dest: './assets/dist/scripts',
  },
  html: {
    src: './templates/**/*.html',
    dest: './assets/dist/templates',
  },
};

const gulpSass = () => {
  return gulp.src(paths.styles.src)
    .pipe(plumber(function(error) {
      log(colors.red(error.message));
      this.emit('end');
    }))
    .pipe(sourcemaps.init()) // Start Sourcemaps
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.')) // Creates sourcemaps for minified styles
    .pipe(gulp.dest(paths.styles.dest))
};

const gulpScripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(plumber(function(error) {
      log(colors.red(error.message));
      this.emit('end');
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
    .pipe(gulp.dest(paths.scripts.dest))
};

const gulpHtml = () => {
  return gulp.src(paths.html.src)
    .pipe(plumber(function(error) {
      log(colors.red(error.message));
      this.emit('end');
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(paths.html.dest))
};

const compressSass = () => {
  return gulp.src(paths.styles.dest + '/**/*.min.css')
  .pipe(gzip())
  .pipe(gulp.dest(paths.styles.dest))
};

const compressScripts = () => {
  return gulp.src(paths.scripts.dest + '/**/*.min.js')
  .pipe(gzip())
  .pipe(gulp.dest(paths.scripts.dest))
};

const clean = () => {
  return del([paths.styles.dest, paths.scripts.dest, paths.html.dest]);
};

const watch = () => {
  gulp.watch(paths.scripts.src, gulpScripts);
  gulp.watch(paths.styles.src, gulpSass);
  gulp.watch(paths.html.src, gulpHtml);
  gulp.watch(paths.scripts.dest + '/**/*.min.js', compressScripts);
  gulp.watch(paths.styles.dest + '/**/*.min.css', compressSass);
}

const build = gulp.series(clean, gulp.parallel(gulpSass, gulpScripts, gulpHtml), gulp.parallel(compressSass, compressScripts));

gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch);
