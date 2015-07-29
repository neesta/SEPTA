var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	ugilfycss = require('gulp-uglifycss'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync');

// Scripts Task - Uglifies
gulp.task('scripts', function(){
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('js/min'));
	gulp.src('css/*.css')
		.pipe(ugilfycss())
		.pipe(gulp.dest('css/'));
});

// Concat Task
gulp.task('concat', function(){
	gulp.src(['js/bootstrap.min.js', 'js/jquery.lazy-load-google-maps.min.js', 'js/min/widget.js'])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('js'));
	/*gulp.src(['css/bootstrap.min.css', 'css/styles.css'])
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('css/'))*/
});

// Sass Task
gulp.task('sassify', function(){
	gulp.src('scss/*.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('css/'))		
		.pipe(browserSync.reload({stream: true}));
});

// Watch Task - JS
gulp.task('watch', function(){
	gulp.watch('js/*.js', ['scripts']);
	gulp.watch('scss/*.scss', ['sassify']);
});

// Image Task - Compress
gulp.task('image', function(){
	gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('images/min/'))
});

gulp.task('default', ['sassify', 'scripts', 'concat']);
gulp.task('dev', ['sassify', 'watch']);