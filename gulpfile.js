'use strict';

let gulp          = require('gulp');
let $             = require('gulp-load-plugins')();

const BUILD_DIRECTORY = 'dist';
const VALIDATION_FILES = ['**/*.js', '!node_modules/**', '!'.concat(BUILD_DIRECTORY).concat('/**'),
                            '!gulpfile.js'];

gulp.task('validate', function() {
  return gulp.src(VALIDATION_FILES)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('help', function(callback){
  console.log("Validate code: gulp validate");
  return callback;
});
