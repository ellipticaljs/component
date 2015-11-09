var gulp=require('gulp'),
    fs = require('fs-extra'),
    concat=require('gulp-concat'),
    uglify = require('gulp-uglify'),
    BUILD_JSON=require('./build.json'),
    BUILD_NAME='elliptical.component.js',
    MIN_NAME='elliptical.component.min.js',
    REPO_NAME='elliptical component',
    WEB_COMPONENTS='./dist/webcomponents-lite.js',
    JQ='./node_modules/component-extensions/dist/jquery.js',
    CSS ='./node_modules/component-extensions/dist/styles.css',
    DUST='./node_modules/component-extensions/dist/dust.js',
    DUSTH='./node_modules/component-extensions/dist/dust-helpers.js',
    MS='./node_modules/component-extensions/dist/mutation-summary.js',
    UTILS='./node_modules/elliptical-utils/dist/elliptical.utils.js',
    MOMENT='./node_modules/component-extensions/dist/moment.js',
    EVENT='./node_modules/elliptical-event/dist/elliptical.event.js',
    BOOTSTRAP='./lib/init.js',
    BOOTSTRAP_NAME='elliptical.init.js',
    DIST='./dist',
    DEMO='./demo/bundle',
    BUNDLE_JSON=require('./bundle.json'),
    BOWER='./bower_components',
    BOWER_EC='./bower_components/elliptical-component',
    BOWER_EC_DIST='./bower_components/elliptical-component/dist';



gulp.task('default',function(){
    console.log(REPO_NAME + ' ..."tasks: gulp build|minify|bundle|demo"');
});

gulp.task('build',function(){
    fileStream(CSS,DIST);
    concatFileStream(BOOTSTRAP,DIST,BOOTSTRAP_NAME);
    concatStream(BUILD_NAME)
        .pipe(gulp.dest(DIST));
});

gulp.task('minify',function(){
    fileStream(CSS,DIST);
    fileStream(BOOTSTRAP,DIST,BOOTSTRAP_NAME);
    concatStream(MIN_NAME)
        .pipe(uglify())
        .pipe(gulp.dest(DIST));
});

gulp.task('bundle',function(){
    fileStream(CSS,DIST);
    concatFileStream(BOOTSTRAP,DIST,BOOTSTRAP_NAME);
    fileStream(BUNDLE_JSON,DIST);
    concatStream(BUILD_NAME)
        .pipe(gulp.dest(DIST));
});

gulp.task('demo',function(){
    fileStream('./demo/hello-world/**/*.*',BOWER + '/hello-world');
    fileStream('./demo/profile-template/**/*.*',BOWER + '/profile-template');
    fileStream('./demo/observable-detail/**/*.*',BOWER + '/observable-detail');
    fileStream('./demo/observable-list/**/*.*',BOWER + '/observable-list');
    fileStream('./elliptical-component.html',BOWER_EC);
    fileStream(CSS,BOWER_EC_DIST);
    fileStream(WEB_COMPONENTS,BOWER_EC_DIST);
    concatFileStream(BOOTSTRAP,BOWER_EC_DIST,BOOTSTRAP_NAME);
    concatStream(BUILD_NAME)
        .pipe(gulp.dest(BOWER_EC_DIST));
});

function srcStream(src){
    if(src===undefined) src=BUILD_JSON;
    return gulp.src(src);
}

function concatStream(name,src){
    if(src===undefined) src=BUILD_JSON;
    return srcStream(src)
        .pipe(concat(name))
}

function fileStream(src,dest){
    gulp.src(src)
        .pipe(gulp.dest(dest));
}

function concatFileStream(src,dest,name){
    gulp.src(src)
        .pipe(concat(name))
        .pipe(gulp.dest(dest));
}

function minFileStream(src,dest,name){
    gulp.src(src)
        .pipe(concat(name))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
}