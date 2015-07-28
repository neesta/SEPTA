var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	ugilfycss = require('gulp-uglifycss')
	concat = require('gulp-concat');

// Scripts Task - Uglifies
gulp.task('scripts', function(){
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('js/min'));
	gulp.src('css/*.css')
		.pipe(ugilfycss())
		.pipe(gulp.dest('css/min'));
});

// Concat Task
gulp.task('concat', function(){
	gulp.src(['js/bootstrap.min.js', 'js/jquery.lazy-load-google-maps.min.js', 'js/min/widget.js'	])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('js'));
	gulp.src(['css/min/bootstrap.min.css', 'css/min/styles.css'])
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('css'))
});

gulp.task('default', ['scripts', 'concat']);