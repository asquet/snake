const gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    browserifyInc = require('browserify-incremental'),
    babelify = require('babelify'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    gulpCopy = require('gulp-copy');


//todo no livereload and sourcemaps for production

function doLint(src) {
    return gulp.src(src)
        .pipe(eslint())
        .pipe(eslint.formatEach('compact', process.stderr))
}

gulp.task('lint-client', function () {
    return doLint(['client/**/*.js']);
});

gulp.task('lint-server', function () {
    return doLint(['server/**/*.js']);
});

gulp.task('copy-static', function () {
    return gulp.src(['index.html', 'main.css'])
        .pipe(gulpCopy('dist/client'))
        .pipe(livereload());
});
gulp.task('watch-static', ['copy-static'], function () {
    return gulp.watch(['index.html', 'main.css'], ['copy-static']);
});
gulp.task('build-client', ['lint-client'], function () {
    let b = browserify({
        entries: './client/index.js',
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true,
        ignoreMissing: true
    });
    browserifyInc(b, {cacheFile: './browserify-cache-client.json'});
    return b
        .transform(babelify, {
            presets: ["es2015", "stage-2"],
            plugins: [["babel-root-import", {"rootPathSuffix": "client"}]]
        })
        .bundle()
        .pipe(source('./client/index.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});

gulp.task('build-server', ['lint-server'], function () {
    gulp.src(['./server/**/*.js'])
        .pipe(babel({
            presets: ["es2015", "stage-2"],
            plugins: [["babel-root-import", {"rootPathSuffix": "client"}]]
        }))
        .pipe(gulp.dest('./dist/server'));
});


gulp.task('build', ['build-client', 'build-server', 'copy-static'], function () {
});
gulp.task('watch-client', ['build-client'], function () {
    livereload.listen();
    return gulp.watch('client/**/*.js', ['build-client']);
});
gulp.task('watch-server', ['build-server'], function () {
    livereload.listen();
    return gulp.watch('server/**/*.js', ['build-server']);
});
gulp.task('nodemon', ['watch-server'], function (cb) {
    let called = false;
    return nodemon({
        // nodemon our expressjs server
        script: 'dist/server/index.js',

        // watch core server file(s) that require server restart on change
        watch: ['dist/server/**/*.js']
    }).on('start', function onStart() {
        // ensure start only got called once
        if (!called) {
            cb();
        }
        called = true;
    }).on('restart', function onRestart() {
        // reload connected browsers after a slight delay
        setTimeout(function reload() {
            livereload();
        }, 500);
    });
});
gulp.task('watch', ['watch-client', 'nodemon', 'watch-static'], function () {
});
gulp.task('default', ['build', 'watch']);