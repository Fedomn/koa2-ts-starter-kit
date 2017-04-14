const gulp = require('gulp');
const clean = require('gulp-clean');
const tslint = require('gulp-tslint');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
const APP_FILES = './app/**/*.ts';
const SERVER_FILE = './bin/server.ts';

gulp.task('clean', function () {
  return gulp.src('build', { read: false }).pipe(clean());
});

gulp.task('lint', () => {
  gulp.src(APP_FILES).pipe(tslint({ formatter: "verbose" })).pipe(tslint.report());
});

gulp.task('tsc', () => {
  return gulp.src([APP_FILES, SERVER_FILE]).pipe(tsProject()).js.pipe(gulp.dest('build'));
});

gulp.task('dev', () => {
  let tsResult = gulp.src([APP_FILES, SERVER_FILE]).pipe(sourcemaps.init()).pipe(tsProject());
  return tsResult.pipe(sourcemaps.write()).pipe(gulp.dest('build'));
});

gulp.task('watch', () => {
  gulp.watch([APP_FILES, SERVER_FILE], ['dev']);
});

gulp.task('default', () => {
  console.log('Hello Gulp');
});
