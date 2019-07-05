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
var app2= express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
var path = require('path');
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
app.use(cors())
app.use(express.static("public"))
 app.all(/(^\/api$)|(^\/api\/.*)/,function (req,res){//listens for requests to the website the odd looking "(/*)? is just a silly way of saying respond to every request
 // localhost/ as well as localhost/this/file/does/not/exist and everywhere in between regardless of what path is being requested.
  var q = url.parse(req.url, true); //silly way of saying this is a url, please split the different parts of the url so I can easily proccess it.
  console.log(q.pathname);//pathname is just one of the many split up peices of a url.
  var filename = "./wwwroot/" + q.pathname;

      if(q.pathname[q.pathname.length-1]!="/"){//we should already know what this does, if not refer to the previous times it is used.
       filename+="/";
      }
  //we are calling the function defined above we should already know what it does.
let getdoc;
console.log("./serverroot"+q.pathname);
      try{
        //getdoc=require("./serverroot/api/login/index.js");
    getdoc=require("./serverroot"+q.pathname);//this gets some file from what url was requested, we don't know if this exists or not.
    console.log("./serverroot"+q.pathname);
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


 
}).listen(80);//binds to port 80 and listens for incoming requests to the server.
app.get( /^((?!api\/?$)((?!api\/)).)*/,function ( req, res ) {
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}
console.log("test in server/index.js cookie:"+req.header("Cookie"));
  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.header("Cookie"),req.query)
    : Promise.resolve()

  promise.then((data) => {
    const context = { data }
    const markup = renderToString(
      <StaticRouter  location={req.url} context={context}>
        <App />
      </StaticRouter>
    )

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
  })
  })
 