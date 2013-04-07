var http = require("http");
var fs = require('fs');
var url = require('url');

function makeRequests(allresults, i, response, startdate, enddate)
{
	if (i < 0) 
	{
		response.write("{}]}");
		response.end();
		return;
	}
	var datitle = allresults[i].title.replace(/ /g, "%20");
	datitle = datitle.replace(/\&\#x2018;/g, '');
	datitle = datitle.replace(/\&\#x2019;/g,'');
	var options2 = {
		 host: 'api.nytimes.com',
		  path: '/svc/search/v1/article?query=title:"' + datitle  + '"&begin_date=' + startdate + '&end_date=' + enddate + '&facets=geo_facet&api-key=columbiahack&format=json'
		};
		console.log("options2: " + options2.path + "\n");
		console.log("allresults: " + allresults[i].title);
		console.log("the title: " + datitle);
		http.get(options2, function(res){
		     var data='';

		    res.on('data', function (chunk){
			data += chunk;
		    });

		    res.on('end',function(){
			var adata = JSON.parse(data);
			try
			{
				var atitle = adata.results[0].title;
				var aloc = adata.facets.geo_facet[0].term;
				var aurl = adata.results[0].url;
			
			response.write( "{ \""+ "title\" :" + "\"" + atitle + "\"," + "\"location\" :\"" + aloc + "\"," + "\"url\" :" + "\"" + aurl + "\"},\n" );
			
			}
			catch (e) {}
			
			makeRequests(allresults, i - 1, response, startdate, enddate);
		    });
		}); 
	}


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
else if (pathname.substring(0,4) === "otx/")
  {

pathname = pathname.substring(4);
var thequery = url.parse(request.url, true).query;
var startd = thequery.start;
var endd = thequery.end;
var searchterm = pathname;

 response.writeHead(200, {"Content-Type": "application/json"});
var options = {
 host: 'api.nytimes.com',
  path:  '/svc/search/v1/article?query=' + searchterm +'&begin_date=' + startd + '&end_date=' + endd + '&facets=geo_facet&api-key=columbiahack&format=json'
};
  http.get(options, function(res){
    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end',function(){
	thedata = JSON.parse(data);
	
		numarticles = thedata.results.length;
		var counter = numarticles;
		console.log(numarticles);

	response.write("{ \"results\" : [\n");
	makeRequests(thedata.results, numarticles -1, response, startd, endd);

	});
	});
console.log(pathname);

  }
  else if (pathname.substring(0,7) === "gplace/")
  {
   pathname = pathname.substring(7);
   console.log(pathname);
   response.writeHead(200, {"Content-Type": "application/json"});
   /*var options = {
     host: 'api.nytimes.com',
      path: '/svc/semantic/v2/geocodes/query.json?&name='+pathname+'&api-key=5a6fcc8f32060f3572a31023df9ae3e3:12:67526310'
    }*/
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

