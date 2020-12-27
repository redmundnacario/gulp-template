// const { task } = require('gulp');
const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

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
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("./dist/css"))
  );
  done();
});

// Watch task with BrowserSync

gulp.task("watch", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    browser: "firefox developer edition"
  });

  gulp
    .watch(["./src/sass/**/*.scss", "**/*.html"], gulp.series(["sass"]))
    .on("change", browserSync.reload);
});
