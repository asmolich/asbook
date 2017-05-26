#!/usr/bin/env node

// asbook.js url | xargs -n 2 wget -O

var safeEval = require('safe-eval'),
    phantom = require('phantom'),
    util = require('util'),
    exec = require('child_process').exec,
    baseurl = process.argv[2];

if (!baseurl) {
    console.log("Please provide url.");
    console.log("Usage: asbook.js <url> | xargs wget -O");
    process.exit(1);
}

phantom.create().then(function(ph) {
  ph.createPage().then(function(page) {
    page.open(baseurl).then(function(status) {
      //console.log(status);
      page.evaluate(function() {
        return document.getElementById('playlistcode').getElementsByTagName('script')[0].innerText;
      }).then(function(text){
        if (text.startsWith('eval')) {
          text = text.substring(4);
          var scr = safeEval(text);
          if (typeof scr == "string") {
            var re = /json_url=\'(.*)\';/;
            var match = re.exec(scr);
            var url = match[1];
            if (url) {
              var child = exec('curl ' + url, function (error, stdout, stderr) {
                  if (error !== null) {
                    console.log('Failed. exec error: ' + error);
                    return;
                  }
                  var json = JSON.parse(stdout);
                  json.playlist.forEach(function(it){
                    var file = it.file;
                    //console.log(file);
                    var regex = /\d+.mp3/;
                    var filename = regex.exec(file)[0];
                    var params = filename + ' ' + file;
                    console.log(params);
                    //exec('wget -O ' + params, function(err, stdout, stderr) {
                    //    if (error !== null) {
                    //        console.log('Failed. exec error: ' + error);
                    //        return;
                    //    }
                    //});
                  })
              });
            }
          }
        }
      });
      page.close();
      ph.exit();
    });
  });
});

