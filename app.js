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
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(fs.readFileSync('index.html'));
    response.end();
  }
  else if (pathname === "src/data.json")
  {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(fs.readFileSync('MarkerClusterer/dev files/src/data.json'));
    response.end();
  }
  else if (pathname === "src/markerclusterer.js")
  {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(fs.readFileSync('MarkerClusterer/dev files/src/markerclusterer.js'));
    response.end();
  }
  else if (pathname.substring(0,7) === "gplace/")
  {
   pathname = pathname.substring(7);
   console.log(pathname);
   response.writeHead(200, {"Content-Type": "application/json"});
   var options = {
     host: 'maps.googleapis.com',
      path: '/maps/api/geocode/json?address='+pathname+"&sensor=false"
    }
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
       console.log(data);
       response.end();
     })
    }); 
  } 
  else if (pathname.substring(0,4) === "nyt/")
  {
   pathname = pathname.substring(4);
   console.log(pathname);
   response.writeHead(200, {"Content-Type": "application/json"});
   var options = {
     host: 'api.nytimes.com',
      path: '/svc/search/v2/articlesearch.json?' + pathname //'index.html'
    }
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
     })
    }); 
  }
  else if (pathname.substring(0,4) === "myt/")
  {
    pathname = pathname.substring(4);
    var arr = pathname.split("/");
    console.log(pathname);
    response.writeHead(200, {"Content-Type": "application/json"});
    var cb = Array(arr[1]-arr[0]);
    for (var i = arr[0], j = 0; i < arr[1]; i++, j++) 
    {
      var sDate = i+"0101";
      var eDate = i+"1231";

      cb[j] = { host: 'api.nytimes.com',
      path: '/svc/search/v2/articlesearch.json?' + "q="+arr[2]+"&begin_date="+sDate+"&end_date="+eDate+"&hl=true&api-key=columbiahack"
      }
    }
    response.write('{"years": [');
    reck(0);


    function reck(k)
    {
      if (k==j)
      {
        response.write("]}");
        response.end();
      }
      else
      {
        http.get(cb[k], function(res){
          var data = '';
          res.on('data', function (chunk){
            data += chunk;
          });
          res.on('error', function(chunk){
           data += "error";
          });
          res.on('end',function(){
           response.write(data);
           if(k+1!=j){
            response.write(', ');
            }
            reck(k+1);
            });
          
        }); 
      }
    }
  }
}).listen(8888);

