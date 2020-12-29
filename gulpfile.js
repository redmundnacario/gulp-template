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
const htmlmin = require("gulp-htmlmin");//minify html
const autoprefixer = require("gulp-autoprefixer");//css compatibility with diff. browsers
const babel = require("gulp-babel");//convert all js to ES5 for compatibility with diff. browsers
const zip = require("gulp-zip");//zipping whole project
const del = require("del");//delete dist files
const plumber = require("gulp-plumber");// for debugging
const notifier = require("gulp-notifier");//notifies when tasks were done successfully


notifier.defaults({
  messages: {
    // sass: "CSS was successfully compiled!",
    // js: "Javascript is ready!",
    // kit: "HTML was delivered!"
  },
//   prefix: "=====",
//   suffix: "=====",
//   exclusions: ".map"
});

filesPath = {
    html: "./src/**/*.html",
    sass: "./src/assets/sass/**/*.scss",
    // js: "./src/js/**/*.js",
    // image: "./src/img/**/*.+(png|jpg|gif|svg)",
    // html: "./html/**/*.kit",
}

filesDestpath = {
    html: "./dist",
    sass : "./dist/assets/css",
    // js : ""./dist/assets/js",
    // image: "./dist/assets/img",
}


// HTML

gulp.task("html", function(done) {
    return (
        gulp.src(filesPath.html)
        .pipe(plumber({errorHandler: notifier.error}))
        .pipe(htmlmin({
            minifyCSS: true, // inline css,
            minifyJS: true, // inline js, not working
            removeComments: true,
            // removeAttributeQuotes: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(filesDestpath.html))
        .pipe(notifier.success("html"))
    )
    done();
})

// Sass

gulp.task("sass", function(done) {
    return (
        gulp
            .src([filesPath.sass])
            // .src(["./src/sass/**/*.scss", "!./src/sass/widget.scss"])
            // *.scss - all files at the end of the path
            //  **/*.scss - match all files at the end of the path plus all children files and folders
            // !*.scss or !**/*.scss - exclude the matching expressions
            .pipe(plumber({errorHandler: notifier.error}))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer())
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
            .pipe(notifier.success("sass"))
    );
    done();
});


// Javascript

gulp.task("javascript", function(done) {
    return gulp
        .src(filesPath.js)
        // .src(["./src/js/alert.js", "./src/js/project.js"])
        .pipe(plumber({errorHandler: notifier.error}))
        .pipe(babel({
            presets: ["@babel/env"]
          })) // convert to ES5
        // .pipe(concat("project.js"))
        .pipe(uglify()) //minify javascript
        .pipe(
            rename({
            suffix: ".min"
            })
        )
        .pipe(gulp.dest(filesDestpath.js))
        .pipe(notifier.success("js"));
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
        // .pipe(notifier.success("kit"))//
    )
    done();
})
*/

// Watch task with BrowserSync

gulp.task("watch", function() {
    browserSync.init({
        server: {
        baseDir: "./dist/"
        },
        browser: "google chrome"
    });

    gulp
        .watch(
            [
                filesPath.html,
                filesPath.sass,
                // filesPath.js,
                // filesPath.images
            ], 
            gulp.parallel([
                            "html",
                            "sass",
                        //  "javascript", 
                        //  "imagemin"
                        //  "kit"
                        ])
        )
        .on("change", browserSync.reload);
});



// Clear cache

gulp.task("clear-cache", function(done) {
    return cache.clearAll(done);
  });
  

// Serve

gulp.task("serve", gulp.parallel([
                                    "html",
                                    "sass",
                                    // "javascript", 
                                    // "imagemin"
                                ]));


// Gulp default command
  
gulp.task("default", gulp.series(["serve", "watch"]));
  


// Zip project
// Zipped all recursively except the node modules

gulp.task("zip", function(done) {
    return(
      gulp.src(["./**/*", "!./node_modules/**/*"])
      .pipe(zip("project.zip"))
      .pipe(gulp.dest("./"))
    )
    done();
  })



// Clean "dist" folder

gulp.task("clean-dist", function(done) {
    return del(["./dist/**/*"]);
      done();
});
  