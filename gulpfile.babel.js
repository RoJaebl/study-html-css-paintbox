// Module
import gulp from "gulp";
import del from "del";
import gulpWebserver from "gulp-webserver";
import gulpPug from "gulp-pug";
import gulpCsso from "gulp-csso";
import gulpSass from "gulp-sass";
import nodeSass from "sass";
import gulpAutoprefixer from "gulp-autoprefixer";
import gulpImage from "gulp-image";
import gulpWebp from "gulp-webp";

// Compiler
const sass = gulpSass(nodeSass);

// Path
const routes = {
  clear: { build: "build" },
  watch: { src: "src/" },
  server: { build: "build" },
  pug: {
    watch: "src/**/*.pug",
    src: "src/index.pug",
    dest: "build/",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css/",
  },
  img: {
    watch: "src/img/*.{svg,jpg,png,webp}",
    src: "src/img/*.{svg,jpg,png,webp}",
    dest: "build/img/",
  },
};

// Task
const html = () =>
  gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));

const css = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpAutoprefixer())
    .pipe(gulpCsso())
    .pipe(gulp.dest(routes.scss.dest));

const clear = () => del([routes.clear.build]);

const webImg = () =>
  gulp.src(routes.img.src).pipe(gulpWebp()).pipe(gulp.dest(routes.img.dest));
const img = () =>
  gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));

const server = () =>
  gulp
    .src(routes.server.build)
    .pipe(gulpWebserver({ livereload: true, open: true }));

const watcher = () => {
  gulp.watch(routes.img.watch, { img, webImg });
  gulp.watch(routes.scss.watch, css);
  gulp.watch(routes.pug.watch, html);
};

// Build
const prepare = gulp.series([clear]);
const assets = gulp.series([html, css, img, webImg]);
const postDev = gulp.parallel([server, watcher]);

export const dev = gulp.series([prepare, assets, postDev]);
