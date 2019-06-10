var http = require('http');
var url = require('url');
var https = require('https');

//this function will be used mostly for twitch api
exports.getSSL=function(Url){
    Url+="?client_id=gxnsm64vnuninzu8f9whol09b82pqx";
    Url=url.parse(Url,true;);
    
var options = {
  host: Url.host,
  port: 443,
  path: Url.pathname+Url.search,
  method: "GET"
};

var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();
}
//getSSL("api.twitch.tv/kraken/users/44322889");

//this function will verify the OAuth token is valid
exports.validateOAuth=function(oAuth,userName){
var ret=false;//ret is short for the return value
var options = {
  host: 'id.twitch.tv',
  port: 443,
  path: '/oauth2/validate',
  method: 'GET',
  headers:{
      'Authorization':'OAuth '+oAuth
  }
};

var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      response=JSON.parse(chunk);
      if(userName==response["login"])
      {
          ret=true;
      }
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
return ret;
}