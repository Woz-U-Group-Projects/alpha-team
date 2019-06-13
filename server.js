const serverHost="localhost";
var http = require('http');
var url = require('url');
var https = require('https');
var twitch= require('./twitch.js');
twitch.getSSL("https://api.twitch.tv/kraken/users/44322889");
http.createServer(function (req, res) {
    console.log(req["url"]);
    var q = url.parse("http://"+serverHost+req["url"],true);
    var qdata=q.query;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(80);