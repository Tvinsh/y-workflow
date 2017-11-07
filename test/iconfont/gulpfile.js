const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/iconfont.js')({
  src: './src',
  dest: './dest/iconfont',
  watch: true,
  iconfont: {
    className: 'iconfont',
    fontPath: '',
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['iconfont:watch']);
});
