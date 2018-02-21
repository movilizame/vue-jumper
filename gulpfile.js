"use strict";

let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;

let files = ['README.md', 'package.json', 'LICENSE'];

// watch files for changes and reload
gulp.task('build', ['uglifyTask', 'copyFiles'], function() {
});


gulp.task('uglifyTask', function () {
    console.log('Uglifying source code ');
    return gulp.src('src/*.js')
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copyFiles', function () {
    let tasks = files.map(function(element){
        console.log('Copying ' + element);
        return gulp.src(element)
            .pipe(gulp.dest('./dist'));
    });
})