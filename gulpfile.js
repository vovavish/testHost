const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };

  return gulp.src('src/**/*.html')
                  .pipe(plumber()).on('data', function (file) {
                    const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options));
                    return file.contents = buferFile
                  })
                  .pipe(gulp.dest('dist/'))
                  .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ]
  return gulp.src('src/styles/**/*.css')
                  .pipe(plumber())
                  .pipe(postcss(plugins))
                  .pipe(gulp.dest('dist/styles/'))
                  .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/.{jpg,png,svg,gif,ico,webp,avif}')
                  .pipe(gulp.dest('dist/images'))
                  .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/*.woff')
                  .pipe(gulp.dest('dist/fonts/'))
                  .pipe(browserSync.reload({stream: true}));
}

function fontscss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ]
  return gulp.src('src/fonts/**/*.css')
                  .pipe(plumber())
                  .pipe(postcss(plugins))
                  .pipe(gulp.dest('dist/fonts/'))
                  .pipe(browserSync.reload({stream: true}));
}

function scripts() {
  return gulp.src('src/scripts/*.js')
                  .pipe(gulp.dest('dist/scripts/'))
                  .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

exports.html = html
exports.css = css
exports.images = images
exports.fonts = fonts
exports.fontscss = fontscss
exports.fonst = scripts
exports.clean = clean

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts, fontscss, scripts));

exports.build = build

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/*.woff'], fonts);
  gulp.watch(['src/fonts/*.css'], fontscss);
  gulp.watch(['src/scripts/*.js'], scripts);
}

function server() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const watchapp = gulp.parallel(build, watchFiles, server);

exports.watchapp = watchapp

exports.default = watchapp