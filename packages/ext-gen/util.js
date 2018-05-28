const crossSpawn = require('cross-spawn');
var greenbold = `\x1b[32m\x1b[1m`
var redbold = `\x1b[31m\x1b[1m`
var prefix = `ℹ ｢ext｣`
var end = `\x1b[0m`
var app =(`${greenbold}${prefix}${end} ext-gen:`)
function boldRed (s) {
  var boldredcolor = `\x1b[31m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${boldredcolor}${s}${endMarker}`)
}

exports.spawnPromise = (command, args, options, substrings) => {
  let child
  let promise = new Promise((resolve, reject) => {
    child = crossSpawn(
      command, 
      args, 
      options
    )
    child.on('close', (code, signal) => {
      resolve({ code, signal});
    })
    child.on('error', (error) => {
      reject(error);
    })
    if (child.stdout) {
      console.log(`${app} has stdout`) 
      child.stdout
        .on('data', (data) => {
        if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) { 
          var str = data.toString()
          var s = str.replace(/\r?\n|\r/g, " ")
          var s2 = s.replace("[INF]", "")
          console.log(`${app}${s2}`) 
        }
      })
    }
    else {
      console.log(`no child`)
    }
    if (child.stderr) {
      console.log(`${app} has stderr`) 
      child.stderr
        .on('data', (data) => {
          var str = data.toString()
          var s = str.replace(/\r?\n|\r/g, " ")
          console.log(`${app} ${boldRed("[ERR]")} ${s}`)
        });
    }
    else {
      console.log(`no child`)
    }
  })
  promise.child = child
  return promise
}
