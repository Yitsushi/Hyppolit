var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('travis', function () {
  return gulp.src(['index.js', 'app/*.js', 'app/**/*.js', 'web/*.js', 'web/**/*.js'])
             .pipe(jshint())
             .pipe(jshint.reporter('default'))
             .pipe(jshint.reporter('fail'));
});

