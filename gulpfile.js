var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    sassLint  = require('gulp-sass-lint'),
    prefix    = require('gulp-autoprefixer');

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false
};

// BUILD SUBTASKS
// ---------------

gulp.task('styles', function() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(gulp.dest('src/css'))
});

gulp.task('sass-lint', function() {
  gulp.src('scss/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['styles']);
});

// BUILD TASKS
// ------------

gulp.task('default', function(done) {
  runSequence('styles', 'watch', done);
});

gulp.task('build', function(done) {
  runSequence('styles', done);
});
