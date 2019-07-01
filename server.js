// setting variable
const serverHost = "localhost";
var default_doc = ["index.html", "index.htm"]; //this is the default document example localhost/ should point to localhost/index.html


//getting modules
require("dotenv").config();
var url = require('url');
var twitch = require('./twitch.js');
var fs = require('fs');
var express = require('express');
var cookie = require('./cookie.js');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');
//end of modules
cookie.start(app); //initializes cookies functionality within express
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889"); // was an example of using twitch's api

app.all("(/api/*)?", function(req, res) { //listens for requests to the website the odd looking "(/*)? is just a silly way of saying respond to every request
    // localhost/ as well as localhost/this/file/does/not/exist and everywhere in between regardless of what path is being requested.
    var q = url.parse(req.url, true); //silly way of saying this is a url, please split the different parts of the url so I can easily proccess it.
    console.log(q.pathname); //pathname is just one of the many split up peices of a url.
    var filename = "./wwwroot/" + q.pathname;

    if (q.pathname.split(".").length == 1) { //if a period is not present in the url after the host name facebook.com is an example of a host name.
        if (q.pathname[q.pathname.length - 1] != "/") { //we should already know what this does, if not refer to the previous times it is used.
            filename += "/";
        }
        //we are calling the function defined above we should already know what it does.


        getdoc = require("./serverroot" + q.pathname); //this gets some file from what url was requested, we don't know if this exists or not.
        if (getdoc.start == undefined) { //server files export the function start as an entry point for the file, if this doesn't function can't be found we have to assume the webpage doesn't exist
            res.writeHead(404, { 'Content-Type': 'text/html' }); //so we will give the commonly known error 404
            return res.end("404 Not Found"); //and write this to the body.
        } else {
            //res.setHeader("Cache-Control","no-cache");
            //res.setHeader();
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET");
            res.set("Access-Control-Allow-Headers", "Content-Type");
            res.set("Access-Control-Allow-Credentials", "true");
            if (req.method == "OPTIONS") {
                res.writeHead(200);
                res.end();
                return;
            }
            getdoc.start(req, res); //the exported start function exists, so we are redirecting to the backend file for the location requested.
        }


    } //this is the end of the if statement that checks if there is a period in the pathname
    else //if this block is running we are looking for a completed file name such as localhost/thisfile.txt
        fs.readFile(filename, function(err, data) {
        if (err) { //if thisfile.txt doesn't exist we will display our favorite error 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        filename = "/wwwroot" + q.pathname;
        if (q.pathname[q.pathname.length - 1] != "/") { //we should already know what this does, if not refer to the previous times it is used.
            filename += "/";
        }
        return res.sendFile(path.join(__dirname + filename)); //we are sending the file that was requested.
    });
}).listen(80); //binds to port 80 and listens for incoming requests to the server.


var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(request.responseText);
    } else if (this.readyState == 4) {
        console.log("status: " + this.status);
        console.log(this.responseText);
    }
};
song = { "title": "some new video", "url": "https://www.youtube.com/watch?v=abcd123456e", "requestedBy": "" };
request.open("POST", "http://localhost/api/songqueue?request=insertsong&channel=bbfambot", true);
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify(song));