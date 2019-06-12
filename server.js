const serverHost="localhost";
var url = require('url');
var twitch= require('./twitch.js');
var fs = require('fs');
var express = require('express');
var cookie = require('./cookie.js');
var app = express();
var path = require('path');
var default_doc=["index.html","index.htm"];
cookie.start(app);
console.log(default_doc[0]);
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889");
  function getDefaultDoc(req,res,filename,callback,i=0){
      var ret=null;
      if((i>=default_doc.length))
      {
      return null;
      }
      console.log("Checking url: "+filename+default_doc[i])
    fs.readFile(filename+default_doc[i], function(err, data) {
            if (err) {
    getDefaultDoc(req,res,filename,callback,i+1);
    }
    else{
        ret="/wwwroot/";
        var q = url.parse(req.url, true);
      if(q.pathname[q.pathname.length-1]!="/"){
       ret+="/";
      }
    ret+=default_doc[i];
    if(typeof(callback)=="function"){
        callback(ret);
    }
    }
      });
   
      
     
    }
function isStatic(filename,callback){
      var ret=true;
      if(filename[filename.length-1]!="/")
      {
          filename+="/";
      }
      filename+="static.js";
 fs.readFile(filename, function(err, data) {
      
    if(data==false||data=="false"){
       
        ret=false;
        
    }
    if(typeof(callback)=="function"){
    callback(ret);
    }
  });

  
 }

 app.get("(/*)?",function (req,res){
  var q = url.parse(req.url, true);
  console.log(q.pathname);
  var filename = "./wwwroot/" + q.pathname;

  if(q.pathname.split(".").length==1){  
      filename="./wwwroot"+q.pathname;
      if(q.pathname[q.pathname.length-1]!="/"){
       filename+="/";
      }
isStatic("./serverroot"+q.pathname,function(static){  
if(static){
    console.log("is static");
    getDefaultDoc(req,res,filename,function(requestPath){
        console.log("filename: "+q.pathname);   
            console.log("\n sendFile("+requestPath+");");        
            res.sendFile(path.join(__dirname+requestPath)); 
    });
    }
else
{
    getdoc=require("./serverroot"+q.pathname);
    if(getdoc.start==undefined){
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");   
    }
    else{
    getdoc.start(req,res);
    }
}
});
  }
  else
    fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(80);