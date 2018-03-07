"use strict";

const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;

const babel = require('gulp-babel');
/* 
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
*/

const files = ['README.md', 'package_publish.json', 'LICENSE'];

gulp.task('build', ['uglify', 'copyFiles'], function() {
});

/*
gulp.task('babelify', function () {
    console.log('Uglifying and babelify source code ');
    return browserify('./src/jumper.js')
        .transform(babelify, {
            presets: ['es2015'], 
            plugins: ['add-module-exports']
        })
    .bundle()
    .on('error', function (err) {
        console.error(err);
        this.emit('end');
    })
    .pipe(source('jumper.js'))
    .pipe(gulp.dest('./dist'));
});
*/

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