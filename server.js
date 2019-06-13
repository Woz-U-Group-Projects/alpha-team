// setting variable
const serverHost="localhost";

//getting modules
var url = require('url');
var twitch= require('./twitch.js');
var fs = require('fs');
var express = require('express');
var cookie = require('./cookie.js');
var app = express();
var path = require('path');
var default_doc=["index.html","index.htm"]; //this is the default document example localhost/ should point to localhost/index.html
//end of modules
cookie.start(app);//initializes cookies functionality within express
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889"); // was an example of using twitch's api

  function getDefaultDoc(req,res,filename,callback,i=0){//allows for auto completion of the url by finding the default doc
      var ret=null; //the value that will be sent back, we don't yet know what to send back so it's set to null for now.
      if((i>=default_doc.length)) //We have already iterated through all of the known default documents.
      {
        if(typeof(callback)=="function"){//If we can't find the file we need to let the requesting thread know we can't find the location...
        //If callback was setup correctly, it should be a function
    callback(ret);
    }
      return null;//this is very important to return so we are not executing this function on an infinite loop.
      }
      console.log("Checking url: "+filename+default_doc[i])
    fs.readFile(filename+default_doc[i], function(err, data) {
            if (err) {//err will result to true if the file could not be found.
            // for example /wwwroot/index.htm doesn't exist so error would be called.
    getDefaultDoc(req,res,filename,callback,i+1); //so we will call this function again using i as an index to check the next string in default_doc
    }
    else{ //this is the else statement so the file does exist and was found in /wwwroot
    // for example since /wwwroot/index.html exists we will serve that file.
        ret="/wwwroot/"; //this is were all of our files that are public are held
        var q = url.parse(req.url, true);
      if(q.pathname[q.pathname.length-1]!="/"){//sometimes the url will have a forward slash at the end for example localhost/static/ but it can also be called localhost/static,
      //however in order to serve localhost/static/index.html the forward slash is needed otherwise we might be trying to request localhost/staticindex.html which just doesn't look right, and result in an error.
       ret+="/"; //adds the forward slash if needed.
      }
    ret+=default_doc[i]; //we are appending the document that exists on the file system to the string we are getting ready to pass back.
    if(typeof(callback)=="function"){//if the passed variable is a function we can pass back the information to the proccess that requested it.
        callback(ret);
    }
    }
      });
     
      
     
    }
function isStatic(filename,callback){//answers the question should we serve a file to the user or perform functions on the server.
      var ret=true;
      if(filename[filename.length-1]!="/") //sometimes the url will have a forward slash at the end for example localhost/static/ but it can also be called localhost/static,
      //however in order to serve localhost/static/index.html the forward slash is needed otherwise we might be trying to request localhost/staticindex.html which just doesn't look right, and result in an error.
      {
          filename+="/";
      }
      filename+="static.js";//this is the file that tells us if we are serving a static file, or performing functions on the backend.
      //side note: static files display the same thing every time it's shown. Unless javascript run on the users browser retrieves data from a server, in which case we still have perform functions on the backend.
      //and the backend may contain information we don't want our users to have access to.
 fs.readFile(filename, function(err, data) {//simply reads the contents of static.js
      
    if(data==false||data=="false"){ // the contents of static.js is either 'true' or 'false'
       
        ret=false;
        
    }
    if(typeof(callback)=="function"){//if callback is setup correctly
    callback(ret);//we can give the requesting thread the information it requested.
    return null;
    }
  });

  
 }

 app.get("(/*)?",function (req,res){//listens for requests to the website the odd looking "(/*)? is just a silly way of saying respond to every request
 // localhost/ as well as localhost/this/file/does/not/exist and everywhere in between regardless of what path is being requested.
  var q = url.parse(req.url, true); //silly way of saying this is a url, please split the different parts of the url so I can easily proccess it.
  console.log(q.pathname);//pathname is just one of the many split up peices of a url.
  var filename = "./wwwroot/" + q.pathname;

  if(q.pathname.split(".").length==1){ //if a period is not present in the url after the host name facebook.com is an example of a host name.
      filename="./wwwroot"+q.pathname;
      if(q.pathname[q.pathname.length-1]!="/"){//we should already know what this does, if not refer to the previous times it is used.
       filename+="/";
      }
isStatic("./serverroot"+q.pathname,function(static){  //we are calling the function defined above we should already know what it does.
if(static){//this is part of the callback 'static' was passed from the isStatic() function 
    console.log("is static");
    getDefaultDoc(req,res,filename,function(requestPath){//we should also already know what this does.
    if(requestPath==null)//default documents were not found
    {
      res.writeHead(404, {'Content-Type': 'text/html'}); //so we will give the commonly known error 404
      return res.end("404 Not Found");   //and write this to the body.
    }
    else //getdefaultdoc doesn't return null.
    {
        console.log("filename: "+q.pathname);   
            console.log("\n sendFile("+requestPath+");");        
            return res.sendFile(path.join(__dirname+requestPath)); //this looks complicated however it just tells the server to serve the file and this is the exact location the file can be found on the computer.
    }
    });
    }
else
{
    getdoc=require("./serverroot"+q.pathname);//this gets some file from what url was requested, we don't know if this exists or not.
    if(getdoc.start==undefined){//server files export the function start as an entry point for the file, if this doesn't function can't be found we have to assume the webpage doesn't exist
      res.writeHead(404, {'Content-Type': 'text/html'}); //so we will give the commonly known error 404
      return res.end("404 Not Found");   //and write this to the body.
    }
    else{
    getdoc.start(req,res); //the exported start function exists, so we are redirecting to the backend file for the location requested.
    }
}
});
  } //this is the end of the if statement that checks if there is a period in the pathname
  else //if this block is running we are looking for a completed file name such as localhost/thisfile.txt
    fs.readFile(filename, function(err, data) {
    if (err) { //if thisfile.txt doesn't exist we will display our favorite error 404
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
    filename="/wwwroot"+q.pathname;
      if(q.pathname[q.pathname.length-1]!="/"){//we should already know what this does, if not refer to the previous times it is used.
       filename+="/";
      }
    return res.sendFile(path.join(__dirname+filename));//we are sending the file that was requested.
  });
}).listen(80);//binds to port 80 and listens for incoming requests to the server.