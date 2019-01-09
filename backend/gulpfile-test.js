const gulp = require("gulp");


function tscWatch() {
  console.log("tscWatch start") ;
}


function watch() {
   gulp.watch("E:/MyWork/PyroCRM-with-Angular-and-Electron/PyroCRM/src-server/**/*.ts", tscWatch );
   console.log("nodemon watch started:", "E:\\MyWork\\PyroCRM-with-Angular-and-Electron\\PyroCRM\\src-server\\**\\*.ts") ;
}

gulp.task("watch", gulp.series(watch)) ;