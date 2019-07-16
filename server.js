// setting variable
const serverHost="localhost";
var default_doc=["index.html","index.htm"]; //this is the default document example localhost/ should point to localhost/index.html
//require("./serverroot/api/login");
//require("./serverroot/api/songqueue");
//getting modules
require("dotenv").config();
var url = require('url');
var twitch= require('./twitch.js');
var fs = require('fs');
var express = require('express');
var cookie = require('./cookie.js');
var app = express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
var path = require('path');
if(process.env.disable_protection=="true"){
  console.error("WARNING: environment variable disable_protection is enabled, this will grant all users full admin rights!!\nThis is not to be used in production.")
}
//end of modules
//react specific imports
import cors from "cors"
import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
import serialize from "serialize-javascript"
import App from '../shared/App'
import routes from '../shared/routes'
//end of react imports
cookie.start(app);//initializes cookies functionality within express
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889"); // was an example of using twitch's api
//app.use(cors())
app.use(express.static("public"))
console.log("Server is running.")
 app.all(/(^\/api$)|(^\/api\/.*)/,function (req,res){//listens for requests to the website the odd looking "(/*)? is just a silly way of saying respond to every request
 // localhost/ as well as localhost/this/file/does/not/exist and everywhere in between regardless of what path is being requested.
  var q = url.parse(req.url, true); //silly way of saying this is a url, please split the different parts of the url so I can easily proccess it.
  //console.log(q.pathname);//pathname is just one of the many split up peices of a url.
  var filename = "./wwwroot/" + q.pathname;

      if(q.pathname[q.pathname.length-1]!="/"){//we should already know what this does, if not refer to the previous times it is used.
       filename+="/";
      }
  //we are calling the function defined above we should already know what it does.
let getdoc;
//console.log("./serverroot"+q.pathname);
      try{
        //getdoc=require("./serverroot/api/login/index.js");
    getdoc=require("./serverroot"+q.pathname);//this gets some file from what url was requested, we don't know if this exists or not.
    //console.log("./serverroot"+q.pathname);
      }
      catch(e){
        console.log(e);
      }
    if(getdoc==undefined||getdoc.start==undefined){//server files export the function start as an entry point for the file, if this doesn't function can't be found we have to assume the webpage doesn't exist
      res.writeHead(404, {'Content-Type': 'text/html'}); //so we will give the commonly known error 404
      console.log("getdoc undefined")
      return res.end("404 Not Found getdoc undefined");   //and write this to the body.
    }
    else{
      //res.setHeader("Cache-Control","no-cache");
      //res.setHeader();
      res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
      res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Allow-Credentials","true");
      if(req.method=="OPTIONS"){
        res.writeHead(200);
        res.end();
        return;
    }
    //console.log(getdoc.start.toString());
    getdoc.start(req,res); //the exported start function exists, so we are redirecting to the backend file for the location requested.
    }


 
}).listen(80);//binds to port 8080 and listens for incoming requests to the server.
app.get( /^((?!api\/?$)(?!\/index.html)((?!api\/)).)*/,function ( req, res ) {
  console.log(process.env.react);
  if(process.env.react=="true"||process.env.react==true){
    console.log("this should run.")
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}
  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.header("Cookie"),req.query)
    : Promise.resolve()

  promise.then((data) => {
    const context = { data  }
    const markup = renderToString(
      <StaticRouter  location={req.url} context={context}>
        <App />
      </StaticRouter>
    )

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
          
        </head>

        <body>
          <div id="app">${markup}</div>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
      </html>
    `)
  })
}
else{
  console.log("this is not supposted to run.")
  var q = url.parse(req.url, true);
  res.sendfile(path.join("./src","/browser",q.pathname));
}
  });
 