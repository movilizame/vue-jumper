"use strict";

let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;

// watch files for changes and reload
gulp.task('build', ['uglifyTask'], function() {
});


gulp.task('uglifyTask', function () {
    return gulp.src('src/*.js')
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('./dist'));
});