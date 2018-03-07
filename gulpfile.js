"use strict";

const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');

const files = ['README.md', 'src/package.json', 'LICENSE'];

gulp.task('build', ['uglify', 'copyFiles'], function() {
});

gulp.task('uglify', function () {
    console.log('Uglifying and babelify source code ');
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('copyFiles', function () {
    let tasks = files.map( function (element) {
        console.log('Copying ' + element);
        return gulp.src(element)
            .pipe(gulp.dest('./dist'));
    });
})