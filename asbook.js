#!/usr/bin/env node

// asbook.js url | xargs -n 2 wget -O

var safeEval = require('safe-eval'),
    phantom = require('phantom'),
    util = require('util'),
    exec = require('child_process').exec,
    baseurl = process.argv[2],
    re = /json_url\s*=\s*\'(.*)\';/;

if (!baseurl) {
    console.log("Please provide url.");
    console.log("Usage: asbook.js <url> | xargs wget -O");
    process.exit(1);
}

function parseJson(url) {
    var child = exec('curl ' + url, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('Failed. exec error: ' + error);
      return;
    }
    var json = JSON.parse(stdout);
    json.playlist.forEach(function(it) {
      var file = it.file;
      //console.log(file);
      var regex = /\d+.mp3/;
      var filename = regex.exec(file)[0];
      var params = filename + ' ' + file;
      console.log(params);
    })
  });
}

function parseURL(url) {
    var child = exec('curl ' + url, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('Failed. exec error: ' + error);
      return;
    }

    var matcher = re.exec(stdout);
    if (matcher[0]) {
        var url = matcher[1];
        //console.log(url);
        if (url) {
            parseJson(url);
        }
    }
  });
}

parseURL(baseurl);

// legasy approach. if pattern is not present, render the page and look for it again
//phantom.create([], {logger: {}}).then(function(ph) {
//    ph.createPage(function(page) {
//        page.open(baseurl, function(status) {
//            console.log('opened?', status);
//            var evaluate = page.evaluate(function() {
//                return document.getElementById('playlistcode').getElementsByTagName('script')[0].innerText;
//            }).then(function(html) {
//                console.log(html);
//            });
//        });
//    });
//    ph.exit();
//});

