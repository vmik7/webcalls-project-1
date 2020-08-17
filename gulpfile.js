let projectFolder = 'dist';
let sourceFolder = 'src';

let fs = require('fs');

let path = {
    build: {
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        js: projectFolder + '/js/',
        img: projectFolder + '/img/',
        fonts: projectFolder + '/fonts/'
    },
    src: {
        html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
        css: sourceFolder + '/scss/style.scss',
        js: sourceFolder + '/js/main.js',
        img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: sourceFolder + '/fonts/*.ttf'
    },
    watch: {
        html: sourceFolder + '/**/*.html',
        css: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*.{ipg,png,svg,gif,ico,webp}',
    },
    clean: './' + projectFolder + '/'
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let fileInclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let groupMedia = require('gulp-group-css-media-queries');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webpHtml = require('gulp-webp-html');
let webpCss = require('gulp-webp-css');
let svgSprite = require('gulp-svg-sprite');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let fonter = require('gulp-fonter');

function browserSyncFunction() {
    browserSync.init({
        server: {
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(webpHtml())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(webpCss())
        .pipe(dest(path.build.css))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cleanCss())
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileInclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
}

function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3 // 0..7
        }))
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream());
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

gulp.task('otf2ttf', function() {
    return src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/'));
});

gulp.task('svgSprite', function() {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../icons/icons.svg' // sprite file name
                //example: true
            }
        }
    }))
    .pipe(dest(path.build.img));
});

function fontsStyle() {
    let fileContent = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (fileContent == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let currentFontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (currentFontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    currentFontname = fontname;
                }
            }
        })
    }
}
function cb() {}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSyncFunction);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;