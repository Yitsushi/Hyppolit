var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('mocha', ['js'], function() {
  return gulp.src('test/**/*.test.js')
             .pipe(mocha({ui: 'tdd', reporter: 'spec'}));
});

gulp.task('js', ['app:js', 'web:js'], function() {
  return gulp.src(['index.js', 'test/index.js', 'test/**/*.js'])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'));
});

gulp.task('app:js', function() {
  return gulp.src(['app/*.js', 'app/**/*.js'])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'));
});

gulp.task('web:js', function() {
  return gulp.src(['web/*.js', 'web/**/*.js'])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'));
});

gulp.task('travis', ['mocha']);
