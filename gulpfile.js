// const { task } = require('gulp');
const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");


// Sass

gulp.task("sass", function(done) {
    return (
        gulp
            .src(["./src/sass/**/*.scss"])
            // .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
            // *.scss - all files at the end of the path
            //  **/*.scss - match all files at the end of the path plus all children files and folders
            // !*.scss or !**/*.scss - exclude the matching expressions
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(cssnano()) // minify css
            .pipe(sourcemaps.write("."))
            .pipe(
                rename(function(path) {
                    if (!path.extname.endsWith(".map")) {
                        path.basename += ".min";
                    }
                })
            )
            .pipe(gulp.dest("./dist/css"))
    );
    done();
});

// Javascript

gulp.task("javascript", function(done) {
    return gulp
        .src("./src/js/**/*.js")
        // .src(["./src/js/alert.js", "./src/js/project.js"])
        // .pipe(concat("project.js"))
        .pipe(uglify()) //minify javascript
        .pipe(
            rename({
            suffix: ".min"
            })
        )
        .pipe(gulp.dest("./dist/js"));
    done();
});

// Images optimization

gulp.task("imagemin", function(done) {
    return (
      gulp.src("./src/img/**/*.+(png|jpg|gif|svg)")
      .pipe(cache(imagemin()))
      .pipe(gulp.dest("./dist/img/"))
    )
    done();
})

// Watch task with BrowserSync

gulp.task("watch", function() {
    browserSync.init({
        server: {
        baseDir: "./"
        },
        browser: "firefox developer edition"
    });

    gulp
        .watch(
            [
                "./src/sass/**/*.scss",
                "**/*.html",
                "./src/js/**/*.js",
                "./src/img/**/*.+(png|jpg|gif|svg)"
            ], 
            gulp.series(["sass", "javascript", "imagemin"])
        )
        .on("change", browserSync.reload);
});


// Clear cache

gulp.task("clear-cache", function(done) {
    return cache.clearAll(done);
  });
  
  // Gulp default command
  
gulp.task("default", gulp.series(["watch"]));
  
  