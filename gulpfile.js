var gulp = require('gulp');
var mochaSpawn = require('gulp-spawn-mocha');

gulp.task('test', function() {
  require('./app.js');
  return gulp.src('app/**/*.spec.js', {read: false})
    .pipe(mochaSpawn({reporter: 'spec'}))
    .once('end', function() {
      process.exit();
    })
    .on('error', function() {
      process.exit();
    });
});
