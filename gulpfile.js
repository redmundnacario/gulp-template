// const { task } = require('gulp');
const gulp = require("gulp");//task runner
const sass = require("gulp-sass");//convert sass to css
const sourcemaps = require("gulp-sourcemaps");//map scss dev in css prod
const browserSync = require("browser-sync").create();//live local server
const cssnano = require("gulp-cssnano");//minifying css files
const uglify = require("gulp-uglify");//minifying js files
const rename = require("gulp-rename");//renaming files (min.js or min.css)
const concat = require("gulp-concat");//combining js files into 1
const imagemin = require("gulp-imagemin");// minifying images
const cache = require("gulp-cache");//caching minified images
const kit = require("gulp-kit"); //combining partials in html

filesPath = {
    sass: "./src/sass/**/*.scss",
    js: "./src/js/**/*.js",
    image: "./src/img/**/*.+(png|jpg|gif|svg)",
    // html: "./html/**/*.kit",
}

filesDestpath = {
    sass : "./dist/css",
    js : "./src/js/**/*.js",
    image: "./dist/img/",
    // html: "./",
}


// Sass

gulp.task("sass", function(done) {
    return (
        gulp
            .src([filesPath.sass])
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
            .pipe(gulp.dest(filesDestpath.sass))
    );
    done();
});


// Javascript

gulp.task("javascript", function(done) {
    return gulp
        .src(filesPath.js)
        // .src(["./src/js/alert.js", "./src/js/project.js"])
        // .pipe(concat("project.js"))
        .pipe(uglify()) //minify javascript
        .pipe(
            rename({
            suffix: ".min"
            })
        )
        .pipe(gulp.dest(filesDestpath.js));
    done();
});


// Images optimization

gulp.task("imagemin", function(done) {
    return (
      gulp.src(filesPath.image)
      .pipe(cache(imagemin()))
      .pipe(gulp.dest(filesDestpath.image))
    )
    done();
})


//  HTML kit templating

/*
gulp.task("kit", function(done) {
    return (
      gulp.src(filesPath.html)
        .pipe(plumber({errorHandler: notifier.error}))//enables whole tasks to run even with error
        .pipe(kit())// combine partials into index.html
        .pipe(htmlmin({
          collapseWhitespace: true
        }))// minify index.html file
        .pipe(gulp.dest(filesDestpath.html))//save to destination file
        // .pipe(notifier.success("kit"))
    )
    done();
})
*/

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
                filesPath.sass,
                // filesPath.html
                filesPath.js,
                filesPath.images
            ], 
            gulp.parallel([
                         "sass",
                         "javascript", 
                         "imagemin"
                        //  "kit"
                        ])
        )
        .on("change", browserSync.reload);
});


// Clear cache

gulp.task("clear-cache", function(done) {
    return cache.clearAll(done);
  });
  
  // Gulp default command
  
gulp.task("default", gulp.series(["watch"]));
  
  