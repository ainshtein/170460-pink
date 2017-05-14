"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");

var postcss = require("gulp-postcss");
var mqpacker = require("css-mqpacker"); //Минифицирует медиазапросы

var minify = require("gulp-csso"); //Минифицирует css

var rename = require("gulp-rename"); //Переименовывает файлы
var imagemin = require("gulp-imagemin"); //Сжимаем картинки
var svgstore = require("gulp-svgstore"); //Делает свг-спрайты
var svgmin = require("gulp-svgmin"); //Минифицирует свг
var server = require("browser-sync").create();
var run = require("run-sequence"); //Запускает задачи последовательно (синхронно)
var del = require("del");

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 versions",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions",
        "last 4 IE versions"
      ]})
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify()) //Минифицируем
    .pipe(rename("style.min.css")) //Переименовываем файл
    .pipe(gulp.dest("build/css")) //Записываем переименованный файл
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}), //Прописываем безопасный уровень оптимизации
      imagemin.jpegtran({progressive: true})  //Прописываем загрузку картинок сразу с последующим улучшением качества
      ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin()) //Минифицируем свг
    .pipe(svgstore({ //Делаем спрайт свг
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg")) //Переименовываем файл
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "symbols",
     fn
     );
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

