var http = require("http");
var fs = require('fs');
var url = require('url');
//var express = require('express');
//var app = express();





//app.use(express.bodyParser());
var body = { "message": "hellooo"};
http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname.substring(1);

  if (pathname === "home")
  {
  //console.log(pathname);
	  response.writeHead(200, {"Content-Type": "text/html"});
	  response.write(fs.readFileSync('index.html'));
	  response.end();
  }
  else
  {
      response.writeHead(200, {"Content-Type": "application/json"});
var options = {
 // host: 'www.google.com',
 host: 'api.nytimes.com',
  path: '/svc/search/v2/articlesearch.json?' + pathname //'index.html'
};
console.log(pathname);
http.get(options, function(res){


    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });

    res.on('error', function(chunk){
	data += "error";
	});

    res.on('end',function(){
	response.write(data);
	response.end();
//	console.log(data);
//        var obj = JSON.parse(data);
       // console.log( obj.buck.email );
    })
//	response.end();
}); 
  }

	
   //   response.end(JSON.stringify(body));
  //}
}).listen(8888);
