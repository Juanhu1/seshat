const gulp = require("gulp");
const path = require("path");

const typescript = require("gulp-typescript");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const newer = require("gulp-newer");
const spawn = require("cross-spawn").spawn;
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const rename = require("gulp-rename");
const tap = require("gulp-tap");
const autoprefixer = require("gulp-autoprefixer");
const nodemon = require('gulp-nodemon') ;

const package = require("./package.json");
const rootPath = process.cwd();
const url = require('url');
const proxy = require('proxy-middleware');
const http_proxy = require('http-proxy-middleware');
const config = require('./gulp-config')();
const $ = require('gulp-load-plugins')({
  lazy: true
});
const git = require('git-rev-sync');
const gutil = require('gulp-util');
var KarmaServer = require('karma').Server;
const fs = require("fs");

const notify = $.notify.withReporter((options, done) => {
  // silent reporter...
  done();
});

const svgSprite = require('gulp-svg-sprite');
const inject = require('gulp-inject');

function clean(path) {
  return del([path], { force: true });
}

function cleanBuild() {
  return clean(getPath(config.build.root, "**/*"));
}

function cleanRelease() {
  return clean(getPath(config.release.root, "**/*"));  
}

function cleanRootFiles() {
  //deleting unused root files in the 
  clean(getPath(config.build.root + "/" + git.short() + "/", "languages.json"));  
  clean(getPath(config.build.root + "/" + git.short() + "/", "blank.html"));  
  clean(getPath(config.build.root + "/" + git.short() + "/images/"));  
  return clean(getPath(config.build.root + "/" + git.short() + "/", "index.html"));    
}

function baseHtml(isWatch) {
  const target = isWatch? config.build.root: config.build.root + git.short();  
  //const enHighlight = fs.readFileSync("./src/css/Highlight.scss", "utf-8").toString();
  return gulp.src(getPath(config.src.root, "**/*.html"))    
    //.pipe($.replace(/<style>/g, '$&' + enHighlight))         
    .pipe($.newer({
      dest: target,
      ext: '.html'
    }))
    .pipe(gulp.dest(target))
  /*  .pipe(
      browserSync.stream({
        once: true
      })
    );  */
}

function html() {
  return baseHtml(false);
}

function htmlWatch() {
  return baseHtml(true);
}

function baseJson(isWatch) {
  const target = isWatch? config.build.root: config.build.root + git.short();
  return gulp.src(getPath(config.src.root, "**/*.json"))
    .pipe(gulp.dest(target))
 /*   .pipe(
      browserSync.stream({
        once: true
      })
    );*/
}

function json() {
  return baseJson(false);
}

function jsonWatch() {
  return baseJson(true);
}

function jsWatch() {
  return gulp.src(getPath(config.src.root, "**/*.js"))
    .pipe(gulp.dest(config.build.root))
/*    .pipe(
      browserSync.stream({
        once: true
      })
    );*/
}

function rootFiles() {
  const enHighlight = fs.readFileSync("./src/css/Highlight.scss", "utf-8").toString();
  gutil.log(enHighlight);
  return gulp.src(getPath(config.src.root, "*.*"))
    .pipe($.replace(/(<script data-main=['"])([^'"]+)(['"]\ssrc=['"])([^'"]+)(['"]>)/g, "$1" + git.short() + "/$2$3" + git.short() + "/$4$5"))      
    .pipe($.replace(/(href=['"])css\//g, "$1" + git.short() + "/css/"))
    .pipe($.replace(/<style>/g, '$&' + enHighlight))     
    .pipe(gulp.dest(config.build.root))
    .pipe(
      browserSync.stream({
        once: true
      })
    );
}




function baseTsc(isWatch, isDebug) {
  const target = isWatch? config.build.root + "/": config.build.root + git.short() + "/";  
  const releaseFiles = $.filter(['**/*.js', '!**/*.spec.js']);
  const tsProject = $.typescript.createProject(config.tsConfig);    
  return tsProject.src()
    .pipe($.newer({
      dest: target,
      ext: '.js'
    }))
    /*
    .pipe($.tslint({
      formatter: "verbose"
    }))    
    .pipe($.tslint.report())
    */
    .pipe($.sourcemaps.init())
    .pipe($.plumber({
      errorHandler: () => {
        notify('"TSC_ERROR", "There was a tsc error, look at the logs..."');
         //beeper(3);;
        //throw new $.util.PluginError("TSC_ERROR", "There was a tsc error, look at the logs...");
      }
    }))
    .pipe(tsProject()).js
    .pipe($.plumber.stop())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(target))    
    .pipe(releaseFiles)
   // .pipe($.uglify())
    .pipe(browserSync.stream({
      once: true
    }));
}

function tsc() {
  return baseTsc(false, false);
}

function tscDebug() {
  return baseTsc(false, true);
}

function tscWatch() {
  return baseTsc(true, false);
}

function tscWatchDebug() {
  return baseTsc(true, true);
}

function baseScss(isWatch) {
  console.log("Tsc") ;
  const target = isWatch? config.build.root: config.build.root + git.short();  
  return gulp
  .src(getPath(config.src.root, "**/*.scss"))
  .pipe(
    newer({
      dest: config.build.root,
      ext: ".css"
    })
  )    
  .pipe(tap(function(file, t) {      
    if (file.path.match(/css\\((?!NoteSettings).)*\.scss/)) {            
      scssNoteSettings();
    }    
  }))            
  .pipe(sourcemaps.init())
  .pipe(
    sass({
      outputStyle: "expanded",
      includePaths: [
        getPath(config.src.root, "css/"),
        getPath(config.nodeModules, "@oracle/oraclejet/dist/scss/")
        ],
      sourcemap: true
    })
  )
  .on("error", sass.logError)
  .pipe(autoprefixer(config.autoprefixerOptions))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(target))
  .pipe(browserSync.stream());  
}

function scssNoteSettings() {
  const target = config.build.css;  
  return gulp
    .src(getPath(config.src.root, "css/NoteSettings.scss"))
    /* Commenting this out as this results in imported scss changes not being picked up. As a side-effect, scss compilation is much slower
    .pipe(
      newer({
        dest: config.build.root,
        ext: ".css"
      })
    )
    */
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: [
          getPath(config.src.root, "css/"),
          getPath(config.nodeModules, "@oracle/oraclejet/dist/scss/")
          ],
        sourcemap: true
      })
    )
    .on("error", sass.logError)
    .pipe(autoprefixer(config.autoprefixerOptions))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(target))
    .pipe(browserSync.stream());  
}

function scss() {
  return baseScss(false);
}

function scssWatch() {  
  return baseScss(true);
}

function copyLibs() {
  let libs = [];
  for (let lib in package.dependencies) {
    libs.push(lib + "/**");
  }
  gutil.log(libs);
  const libPath = config.build.root + git.short() + "/js";
  gutil.log(libPath);
  gutil.log(getPath(config.nodeModules, libs.join(",")));
  gutil.log(getPath(libPath, "libs/" + libs.join(",").replace(/(.+)\*\*/, "$1")));
  
  //return gulp.src(getPath(config.nodeModules, libs.join(",")))
  //  .pipe(gulp.dest(getPath(libPath, "libs/" + libs.join(",").replace(/(.+)\*\*/, "$1"))));        
  return gulp.src(getPath(config.nodeModules, "{" + libs.join(",") + "}"))
    .pipe(gulp.dest(getPath(libPath, "libs/")));    
}

function copyWebInf() {  
  return gulp.src(config.webInf)        
  .pipe(gulp.dest(config.release.webInf));  
}

function copyBuildToRelease() {    
  return gulp.src(getPath(config.build.root, "**/*"))        
  .pipe(gulp.dest(config.release.root));  
}

function prepareRJS() {
  return gulp.src("require.build.js")
  .pipe($.replace(/baseUrl:\s['"]\.\/([^'"]+)['"],/, 'baseUrl: "./' + git.short() + '/$1",'))
  .pipe($.rename("require.out.js"))
  .pipe(gulp.dest('.'));
}

function removeOutJS() {
  return gulp.src('require.out.js')
    .pipe($.clean({ force: true }));
}

function optimize() {  
  const rJsPath = getPath("./node_modules/.bin/r_js");
  return spawn(rJsPath, ["-o", "require.out.js"], { stdio: "inherit", stderr: "inherit" });  
}

function baseWar(isLimited) {
  const warName = isLimited? 'enotes.ui-1.0.0-limited-rev_' + git.long() + '.war': 'enotes.ui-1.0.0-rev_' + git.long() + '.war'
  return gulp.src(config.release.root + '**/*')
    .pipe($.war({
      welcome: 'index.html',
      displayName: 'ENotesUI'      
    }))    
    .pipe($.zip(warName))        
    .pipe(gulp.dest("../../../target"))    
    .pipe(gulp.dest("release"));
} 

function war() {
  return baseWar(false);
}

function warLimited() {
  return baseWar(true);
}

function baseOther(isWatch) {
  const target = isWatch? config.build.root: config.build.root + git.short();
  return gulp.src(config.otherFiles, {
    //  since: gulp.lastRun(other)
    })
    .pipe(gulp.dest(target));
}

function other() {
  return baseOther(false);
}

function otherWatch() {
  return baseOther(true);
}

function svg(){
  return baseSvg(false);
}

function svgWatch(){
   return baseSvg(true);
}

function baseSvg(isWatch) {
  function makeSvgSpriteOptions() {
    return {
      shape               : {
        id              : {
            generator   : function(name) {
                return 'en-' + path.basename(name, '.svg')
            }
        }
      },
      mode: {
        symbol: {
          dest: '.',
          example: true,
          sprite: 'core.svg'
        },
      }
    };
  }
 
  const target = config.build.svg;  
  return gulp.src(getPath(config.src.root, '**/*.svg'))
        .pipe(svgSprite(makeSvgSpriteOptions()))
        .pipe(gulp.dest(getPath(target)))
};

function svgInjector(){

        var svgs = gulp.src(getPath(config.build.svg, './core.svg'))
                  .pipe(svgstore({ inlineSvg: true }));
 
        function fileContents (filePath, file) {
           return file.contents.toString();
        }
 
    return gulp.src(getPath(config.build.root, './index.html'))
          .pipe(inject(svgs, { transform: fileContents }))
          .pipe(gulp.dest(getPath(config.build.root)))
          .pipe(
            browserSync.stream({
              once: true
            })
          ); 

};

function imagesWatch() {
  return gulp.src(getPath(config.src.root, '**/*.svg'))          
    .pipe(gulp.dest(getPath(config.build.root)))
    .pipe(
      browserSync.stream({
        once: true
      })
    );
}

function startBrowserSync(baseDir, routes) {
  
  var ENotesServiceProxyOptions = url.parse('http://slc13myy.us.oracle.com:7213/oalcrm/web/ISRService/');  
  ENotesServiceProxyOptions.route = '/oalcrm/web/ISRService/';  
  
  var CTILoggerProxy = url.parse('http://slc04ozs.us.oracle.com:8303/oalcrm/web/event-collecting-web/');  
  CTILoggerProxy.route = '/oalcrm/web/event-collecting-web/';       

  //var analyticsProxyOptions = url.parse('http://localhost:3002/js/');
  //analyticsProxyOptions.route = '/oalcrm/web/ISRService/proxy/analytics/enotes-analytics-ui/js/';        

  var leaderboardProxyOptions = url.parse('http://localhost:3003/js/');
  leaderboardProxyOptions.route = '/oalcrm/web/ISRService/proxy/leaderboard/enotes-leaderboard-ui/js/';          
 
  var ctiProxyOptions = url.parse('http://slc10zxt.us.oracle.com:8003/event-notification-web/sse/');
  ctiProxyOptions.route = '/SSEService/';          

  //var ctiUIProxyOptions = url.parse('http://localhost:3004/js/');
  //ctiUIProxyOptions.route = '/oalcrm/web/ISRService/proxy/cti-medium/cti-extension-ui/js/';        

  var ngccProxyOptions = url.parse('http://slc13myy.us.oracle.com:7213/');
  ngccProxyOptions.route = '/NGCCService/';    
  
  var ENotesServiceProxyOptionsTemplates = url.parse('http://den01gjq.us.oracle.com:7001/sc-extension-service/resources/');  
  ENotesServiceProxyOptionsTemplates.route = '/oalcrm/web/ISRServiceTemplates/';  

  var scOptions = {
    target: 'http://localhost:3001', // target host
    changeOrigin: true,
    pathRewrite: {
        '^/oalcrm/web/ISRService/proxy/[^/]+/SC/sc-extension-ui/js/' : '/js/',     // rewrite path         
        '^/oalcrm/web/ISRService/proxy/SC/sc-extension-ui/js/' : '/js/'     // rewrite path         
    }
  };

  var ctiOptions = {
    target: 'http://localhost:3004', // target host
    changeOrigin: true,
    pathRewrite: {
        '^/oalcrm/web/ISRService/proxy/[^/]+/cti-medium/cti-extension-ui/js/' : '/js/',     // rewrite path         
        '^/oalcrm/web/ISRService/proxy/cti-medium/cti-extension-ui/js/' : '/js/'     // rewrite path         
    }
  };

  var analyticsOptions = {
    target: 'http://localhost:3002', // target host
    changeOrigin: true,
    pathRewrite: {
        '^/oalcrm/web/ISRService/proxy/[^/]+/analytics/enotes-analytics-ui/js/' : '/js/',     // rewrite path         
        '^/oalcrm/web/ISRService/proxy/analytics/enotes-analytics-ui/js/' : '/js/'     // rewrite path         
    }
  };

  browserSync.init({
    injectChanges: true,
    ui: false,
    notify: false,
    ghostMode: false,
    server: {
      baseDir: baseDir,
      routes: routes,
      middleware: [        
        //http_proxy("/oalcrm/web/ISRService/proxy/**/SC/sc-extension-ui/js/**", scOptions),                
        //http_proxy("/oalcrm/web/ISRService/proxy/**/analytics/enotes-analytics-ui/js/**", analyticsOptions),        
        //proxy(leaderboardProxyOptions),        
        proxy(ctiProxyOptions),        
        //http_proxy("/oalcrm/web/ISRService/proxy/**/cti-medium/cti-extension-ui/js/**", ctiOptions),
        proxy(CTILoggerProxy),
        proxy(ngccProxyOptions),
        proxy(ENotesServiceProxyOptions),        
        proxy(ENotesServiceProxyOptionsTemplates)        
      ]
    }
  });
}

function getPath(param1, param2) {
  return path.resolve(param1, param2).replace(/\\/gi, "/") ;
}

function serveRelease() {
  startBrowserSync(config.release.root, {});
}


gulp.task('nodemon', function (done) {
  nodemon({
    script: 'seshat-backend.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
})


function watch() {    
  const npmLibPath = "/js/libs/";  
  var libPathObj = {};  
  libPathObj[npmLibPath] = config.nodeModules;
 // console.log('npmLibPath1:'+npmLibPath, " - ", config.nodeModules ) ;
//  startBrowserSync(config.build.root, libPathObj);  
nodemon({
  script: 'build/seshat-backend.js'
, ext: 'js html'
, env: { 'NODE_ENV': 'development' }

})
   allWatch() ;

   //gulp.parallel( 'nodemon', allWatch ) ;
   //gulp.start('nodemon');
   //allWatch() ;
}

function nodeWatch() {
    gulp.start('nodemon'); 
} 
    
function allWatch() {
  gulp.watch(getPath(config.src.root, "**/*.html"), htmlWatch );
  gulp.watch(getPath(config.src.root, "**/*.ts"), tscWatch );
  gulp.watch(getPath(config.src.root, "**/*.scss"), scssWatch);
  gulp.watch(getPath(config.src.root, "**/*.json"), jsonWatch);  
  gulp.watch(getPath(config.src.root, "**/*.js"), jsWatch);  
//  gulp.watch(getPath(config.src.root, '**/*.svg'), imagesWatch);   
}

function watchDebug() {    
  const npmLibPath = "/js/libs/";  
  var libPathObj = {};
  
  libPathObj[npmLibPath] = config.nodeModules;
  console.log('npmLibPath:'+npmLibPath, " - ", config.nodeModules ) ;
  startBrowserSync(config.build.root, libPathObj);    
  gulp.watch(getPath(config.src.root, "**/*.html"), gulp.series(htmlWatch,svgWatch,svgInjector));
  gulp.watch(getPath(config.src.root, "**/*.ts"), tscWatchDebug);
  gulp.watch(getPath(config.src.root, "**/*.scss"), scssWatch);
  gulp.watch(getPath(config.src.root, "**/*.json"), jsonWatch);  
  gulp.watch(getPath(config.src.root, "**/*.js"), jsWatch);  
  gulp.watch(getPath(config.src.root, '**/*.svg'),gulp.series(imagesWatch,svgWatch,svgInjector));   
}

const build = gulp.series(
  cleanBuild, 
  gulp.parallel(html, tsc, scss, other, rootFiles,svg),
  svgInjector,
  cleanRootFiles  
);

const buildDebug = gulp.series(
  cleanBuild, 
  gulp.parallel(html, tscDebug, scss, other, rootFiles,svg),
  svgInjector,
  cleanRootFiles  
);

const buildWatch = gulp.series(
  cleanBuild, 
  gulp.parallel(  htmlWatch, 
                  tscWatch,
                  scssWatch, 
                  otherWatch
                //  svgWatch
                ),
 // svgInjector
);

const buildWatchDebug = gulp.series(
  cleanBuild, 
  gulp.parallel(htmlWatch, tscWatchDebug, scssWatch, otherWatch,svgWatch),
  svgInjector
);


function copyLibsForKarma() {
  let libs = [];
  for (let lib in package.dependencies) {
    libs.push(lib + "/**");
  }
  gutil.log(libs);
  const libPath = config.build.root + "/js";
  gutil.log(libPath);
  gutil.log(getPath(config.nodeModules, libs.join(",")));
  gutil.log(getPath(libPath, "libs/" + libs.join(",").replace(/(.+)\*\*/, "$1")));
  
  //return gulp.src(getPath(config.nodeModules, libs.join(",")))
  //  .pipe(gulp.dest(getPath(libPath, "libs/" + libs.join(",").replace(/(.+)\*\*/, "$1"))));        
  return gulp.src(getPath(config.nodeModules, "{" + libs.join(",") + "}"))
    .pipe(gulp.dest(getPath(libPath, "libs/")));    
}

function karma(done) {
 // console.log("path:", config.build.root + git.short()) ;
  new KarmaServer({
    configFile: require('path').resolve('test/karma.conf.js'),
    myPath: fs.existsSync(config.build.root + git.short())?git.short():"" 
  }, function(exitCode) {
        done();
        process.exit(exitCode);
  }).start();
}

function baseDockerBuild(isWin7, cb) {
  const imageName = 'drc/central-ui';
  if (isWin7) {
    execCommand('docker',["--tlsverify=false", 'build', '-t', imageName, '.'], cb);
  } else {
    execCommand('docker',['build', '-t', imageName, '.'], cb);
  }
}

function dockerBuildWin7(cb) {
  baseDockerBuild(true, cb);
}

function dockerBuild(cb) {
  baseDockerBuild(false, cb);
}

function execCommand(command, args, cb) {  
  const ctx = spawn(command, args);
  ctx.stdout.on('data', function(data) {
      process.stdout.write(data);
  });
  ctx.stderr.on('data', function(data) {
      process.stderr.write(data);
  });
  ctx.on('close', function(code) {
      if(cb){cb(code === 0 ? null : code);}
  })

}

gulp.task("default", gulp.series(build, watch));
gulp.task("watch", gulp.series(buildWatch, watch));
gulp.task("watch-debug", gulp.series(buildWatchDebug, watchDebug));
gulp.task("build", build);
gulp.task("release", gulp.series(cleanRelease, build, copyLibs, prepareRJS, optimize, removeOutJS, copyWebInf, war));
gulp.task("release-debug", gulp.series(cleanRelease, buildDebug, copyLibs, copyBuildToRelease, copyWebInf, war));
gulp.task("release-limited", gulp.series(cleanRelease, build, copyLibs, prepareRJS, optimize, removeOutJS, copyWebInf, warLimited));
gulp.task("release-limited-debug", gulp.series(cleanRelease, buildDebug, copyLibs, copyBuildToRelease, copyWebInf, warLimited));
gulp.task("watch-release", serveRelease);

gulp.task('test', gulp.series(  karma));

gulp.task('war', war);

gulp.task('docker-build',   function(cb) {
  //dockerBuild(cb);
  dockerBuildWin7(cb);  
});

gulp.task('docker-build-win7', function(cb) {
  dockerBuildWin7(cb);  
});