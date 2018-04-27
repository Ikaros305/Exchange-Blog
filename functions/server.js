var http = require("http");
var fs = require("fs");
var url = require("url");

var port = process.env.PORT || 8080;

var contentTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/js",
  png: "image/png",
  jpg: "image/jpeg",
  mov: "video/mov",
}

http.createServer((req, res)=>{
  if (req.url == "" || req.url == "/" || req.url == "/de-de/" || req.url == "/de-de") {
    res.writeHead(302,  {Location: "http://" + req.headers.host + "/de-de/index.html"});
    res.end();
  } else if (req.url == "/en-us/" || req.url == "/en-us") {
    res.writeHead(302,  {Location: "http://" + req.headers.host + "/en-us/index.html"});
    res.end();
  }


  else if (req.url == "/testscr.js") {
    fs.readFile('testscr.js',(err,data)=>{
      if (err) throw err;
      fs.appendFile('testscr2.js', data + "document.getElementById('body').innerHTML += 'x';", (err)=>{
        if (err) throw err;
        fs.readFile("testscr2.js", (err,data)=>{
          if (err) throw err;
          res.write(data);
          fs.unlink("testscr2.js",(err)=>{
            if (err) throw err;
            res.end();
          });
        });
      });
    });
  }




  else {
    fs.readFile("."+req.url, (err,data)=>{
	  if (!err) {
        var parts = req.url.split("/");
        var extension = parts[parts.length-1].split(".")[1];
        res.writeHead(200, {'Content-Type': contentTypes[extension]});
        res.end(data);
      } else {
        var parts = req.url.split("/");
        var file = "index.html";
        if (parts[parts.length - 1] != "") {
          file = "/" + file;
        }
        fs.readFile("."+req.url+file, (err,data)=>{
          if (!err) {
            res.writeHead(302,  {Location: "http://" + req.headers.host + req.url + file});
            res.end();
          } else {
            res.writeHead(404);
            res.end("ERROR 404: FILE NOT FOUND");
          }
        });
      }
    });
  }
}).listen(port);

/*
Versuch, Datei zu öffnen
Wenn err: de-de und en-us
Wenn err: +index.html bzw. +/index.html
Wenn err: 404
*/

//Erstellen eines Video-Thumbnails: https://stackoverflow.com/questions/13079742/how-to-generate-video-thumbnail-in-node-js