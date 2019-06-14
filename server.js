const serverHost = "localhost";
var http = require('http');
var url = require('url');
var https = require('https');
var twitch = require('./twitch.js');
var fs = require('fs');
var default_doc = ["index.html", "index.htm"];
console.log(default_doc[0]);
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889");
function getDefaultDoc(res, filename, i = 0) {
    if ((i >= default_doc)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end("404 Not Found");
    }
    fs.readFile(filename + default_doc[i], function(err, data) {
        if (err == false) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        } else {
            getDefaultDoc(res, filename, i++);
        }
    });



}
http.createServer(function(req, res) {
    var q = url.parse(req.url, true);
    console.log(q.pathname)
    var filename = "./wwwroot/" + q.pathname;

    if (q.pathname[q.pathname.length - 1] == "/") {
        getDefaultDoc(res, filename);
    } else
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
}).listen(80);
var express = require('express');
var app = express();

app.get('/', function(req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'mypassword',
        server: 'localhost',
        database: 'SchoolDB'
    };

    // connect to your database
    sql.connect(config, function(err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select * from Student', function(err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);

        });
    });
});

var server = app.listen(5000, function() {
    console.log('Server is running..');
});