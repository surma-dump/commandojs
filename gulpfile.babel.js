import gulp from 'gulp';
import gtb from './gtb';
import pkg from './package.json';
import commonTasks from './gtb/common-tasks';
import serve from './gulp-tasks/serve';
import * as metadata from './gulp-tasks/metadata';

var task = gtb();
var debug = process.env.ENV !== 'prod';

task.filesIn('app')
  .withExtension('js')
  .excluding(/^nobabel\//)
  .run(commonTasks.babel({
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .run(commonTasks.minifyJs(), {skip: debug});
task.filesIn('app')
  .withExtension('js')
  .matching(/^nobabel\//)
  .run(commonTasks.minifyJs(), {skip: debug});
task.filesIn('app')
  .withExtension('sass', 'scss')
  .run(commonTasks.compileSass())
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss(), {skip: debug});
task.filesIn('app')
  .withExtension('css')
  .run(commonTasks.autoprefixer())
  .run(commonTasks.minifyCss(), {skip: debug});
task.filesIn('app')
  .withExtension('html')
  .run(commonTasks.replace('{{_!_version_!_}}', pkg.version))
  .run(commonTasks.minifyHtml(), {skip: debug})
task.filesIn('app')
  .withExtension('jpeg', 'jpg', 'png', 'svg')
  .run(commonTasks.imagemin());
task.filesIn('node_modules/pixi.js')
  .inFolder('bin')
  .withName('pixi.js')
  .run(commonTasks.minifyJs(), {skip: debug})
  .put('modules');
task.filesIn('node_modules/babel-standalone')
  .withName('babel.js')
  .run(commonTasks.minifyJs(), {skip: debug})
  .put('modules');
task.filesIn('assets')
  .withExtension('png')
  .run(metadata.sprite())
  .put('assets');

gulp.task('build', task.build());
gulp.task('default', gulp.series('build'));
gulp.task('serve', gulp.series('build', serve));
