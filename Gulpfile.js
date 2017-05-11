var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');


gulp.task('compile:js', function (cb) {
    return gulp.src('map-elections.ts')
        .pipe(typescript({
            "target": "es5"
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('compile:scss', function () {
    return gulp.src('style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename("style.css"))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:css', ['compile:scss'], function() {
    return gulp.src('dist/style.css')
        .pipe(cleanCSS())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:js', function (cb) {
    pump([
            gulp.src('dist/map-elections.js'),
            uglify(),
            rename("map-elections.min.js"),
            gulp.dest('dist')
        ],
        cb
    );
});

var browserSync = require('browser-sync');
function browserSyncInit(baseDir, files, browser) {
    browser = 'default';
    browserSync.instance = browserSync.init(files, {
        startPath: '/',
        host: '0.0.0.0',
        server: {
            baseDir: baseDir
        },
        browser: browser,
        ghostMode: false
    });
}
gulp.task('watch', function(){
    return gulp.watch('map-elections.ts', ['compile:js']);
});
gulp.task('build', ['build:js', 'build:css']);

gulp.task('serve', ['watch'], function (cb) {
    browserSyncInit('.', [
        'dist/map-elections.js',
        'index.html'
    ]);
});
