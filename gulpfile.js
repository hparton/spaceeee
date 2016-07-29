
var gulp = require("gulp");
var gutil = require("gulp-util");
var notify = require('gulp-notify');
var source = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");

var browserSync = require("browser-sync").create();

var ENTRY_FILE = "./src/main.js";
var OUTPUT_DIR = "./bin";
var OUTPUT_FILE = "output.js";
var DELAY = 50;

gulp.task("watch", function () {
    var b = browserify({entries: [ ENTRY_FILE ] }).transform(babelify, { presets: ["es2015"] });

    function bundle() {
        b.bundle()
        .on("log", gutil.log)
        .on("error", notify.onError())
        .pipe(source(OUTPUT_FILE))
        .pipe(buffer())
        .pipe(gulp.dest(OUTPUT_DIR))
        .pipe(browserSync.reload({ stream: true }));
    }

    watchify(b, { delay: DELAY }).on("update", bundle);
    bundle();
});

gulp.task("serve", function () {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false
    });
});

gulp.task("default", [ "watch", "serve" ]);