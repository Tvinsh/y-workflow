/**
 *  字体图标
 */
const path = require('path');
const gulp = require('gulp');

const plugins = {
    consolidate: require('gulp-consolidate'),
    rename: require('gulp-rename'),
    iconfont: require('gulp-iconfont'),
    iconfontCss: require('gulp-iconfont-css')
}

/**
 * 字体图标注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 待处理文件
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.iconfont iconfont配置
 */

module.exports = (options) => {
    const timestamp = Math.round(Date.now() / 1000);
    const fontName = 'symbols';

    function mapGlyphs (glyph) {
        return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
    }

    const {
        taskName = 'iconfont',
        src,
        dest,
        watch,
        taskHandler = () => {

          const stream = gulp.src(path.join(src, '*.svg'))
            .pipe(plugins.iconfont({
                fontName,
                formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
                timestamp,
                log: () => {} // suppress unnecessary logging
            }))
            .on('glyphs', (glyphs) => {
                const iconfontobj = Object.assign({ className: 'iconfont', fontPath: '', fontName, normalize:true, fontHeight: 1002, glyphs: glyphs.map(mapGlyphs) }, iconfont);
                gulp.src(src+'/_icon.css')
                    .pipe(plugins.consolidate('lodash', iconfontobj))
                    .pipe(plugins.rename({ basename: fontName }))
                    .pipe(gulp.dest(dest)) // set path to export your CSS

                // if you don't need sample.html, remove next 4 lines
                gulp.src(src+'/example/index.html')
                    .pipe(plugins.consolidate('lodash', iconfontobj))
                    .pipe(plugins.rename({ basename: 'sample' }))
                    .pipe(gulp.dest(dest)) // set path to export your sample HTML
            })
            .pipe(gulp.dest(dest)) // set path to export your fonts

           return stream;
        },
        iconfont = {},
    } = options;

    gulp.task(taskName, taskHandler);

    if (watch) {
        gulp.task(`${taskName}:watch`, [taskName], () => {
            gulp.watch(src, [taskName]);
        });
    }
};
