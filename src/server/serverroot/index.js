var url=require("url");
exports.start=function(req,res){//entry point into api folder
var Url=url.parse(req.url,true);//gets url
var query=Url.query;//gets the queries in the url
if(query["getTest"]!=undefined)//if query getTest is not undefined it exists example: localhost/api?getTest=1 and the value is stored in the query[name_of_query]
{ 
console.log("test paramater value: "+query["getTest"]);//this is just a template so we just have a simple command for now.
res.write("test paramater value: "+query["getTest"]); //we are simply displaying this to the screen but we can do more api things later.
}
res.end();
}