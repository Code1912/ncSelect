/**
 * Created by Code1912 on 2016/7/6.
 */


var plugins={
    gulp:require("gulp"),
    uglify:require("gulp-uglify"),
    notify:require("gulp-notify"),
    concat:require("gulp-concat"),
    browserSync:require("browser-sync"),
    fs:require("fs"),
    historyApiFallback: require('connect-history-api-fallback'),
    compress: require('compression')
    // ,cssmin : require('gulp-minify-css')
}

var gulp = plugins.gulp;
gulp.task('js', function () {
    gulp.src("src/**/*.js")
        .pipe(gulp.dest('dist'))
});

gulp.task('css', function () {
    gulp.src("src/**/*.css")
        .pipe(gulp.dest('dist'))
});
gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
    // .pipe(plugins.notify({message:"html deploy"}))
});

gulp.task('browser-sync', function() {
    plugins.browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [plugins.historyApiFallback(), plugins.compress()]
        }
    });
    gulp.watch("src/**/*.js",["js"]).on("change",  change);
    gulp.watch("src/**/*.html",["html"]).on("change",  change);
    gulp.watch("src/**/*.css",["css"]).on("change",  change);
});
var change=function()
{
    console.log("file changed")
    plugins.browserSync.reload();
}
gulp.task('default', function () { 
    gulp.run("js");
    gulp.run("css");
    gulp.run("html");
    gulp.run("browser-sync");
});