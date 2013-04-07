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
  var query = url.parse(request.url, true).query;
  if (pathname === "home")
  {
console.log("QUERY = " + query.q);
	  response.writeHead(200, {"Content-Type": "text/html"});
	  response.write(fs.readFileSync('index.html'));
	  response.end();
  } else if (pathname.substring(0,4) === "oth/")
  {

pathname = pathname.substring(4);
 response.writeHead(200, {"Content-Type": "application/json"});
var options = {
 host: 'api.nytimes.com',
  path:  '/svc/search/v1/article?' + pathname
};

http.get(options, function(res){


    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end',function(){
	thedata = JSON.parse(data);
	try
	{
		var loc = thedata.facets.geo_facet[0].term;
		var thetitle = thedata.results[0].title;
		var theurl = thedata.results[0].url;
		console.log(loc);
		console.log(thetitle);
		console.log(theurl);
		response.write("{\"PlaceName\" : \"" + loc + "\", \"title\" : \"" + thetitle + "\", \"url\" : \""+theurl+"\"}");
	}
	catch (e)
	{
		console.log("no");
	}
	
	response.end();
    })

}); 
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

  else if (pathname.substring(0,4) === "nyt/")
  {
	pathname = pathname.substring(4);
console.log(pathname);
      response.writeHead(200, {"Content-Type": "application/json"});
var options = {
 host: 'api.nytimes.com',
  path: '/svc/search/v2/articlesearch.json?' + pathname
};
console.log(pathname);
http.get(options, function(res){


    var data = '';

    res.on('data', function (chunk){
        data += chunk;
    });

    res.on('end',function(){
	response.write(data);
	
	response.end();
    })
}); 
  }

}).listen(8888);
