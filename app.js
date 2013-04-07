var http = require("http");
var fs = require('fs');
var url = require('url');
//var express = require('express');
//var app = express();

//app.use(express.bodyParser());
var body = { "message": "hellooo"};
http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  if (pathname === "/home")
  {
  //console.log(pathname);
	  response.writeHead(200, {"Content-Type": "text/html"});
	  response.write(fs.readFileSync('index.html'));
	  response.end();
  }
  else
  {
      response.writeHead(200, {"Content-Type": "application/json"});
     // response.write("SDF");
	
      response.end(JSON.stringify(body));
  }
}).listen(8888);
