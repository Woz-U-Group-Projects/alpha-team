var http = require('http');
var url = require('url');
var https = require('https');

//this function will be used mostly for twitch api
//Makes a get request to the following url through https protocol.
exports.getSSL=function(Url, clientAdd=true){
  //clientAdd is a boolean should we add our client_id at the end of the url.
 //the client_id is a requirement by twitch to identify who is making a request to their API

    Url=url.parse(Url,true);
    var qdata=Url.query;
    if(qdata.client_id==undefined && clientAdd==true)
    {
        if(Url.search==""){
    Url.search="?client_id=gxnsm64vnuninzu8f9whol09b82pqx";
        }
        else
        {
            Url.search+="&client_id=gxnsm64vnuninzu8f9whol09b82pqx";
        }
    }
    
var options = {
  host: Url.host,
  port: 443,
  path: Url.pathname+Url.search,
  method: "GET"
};
console.log("requesting resource:"+Url.host+":443");
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

exports.postSSL=function(Url,data,callback)
{
    Url=url.parse(Url,true);
var options = {
  host: Url.host,
  port: 443,
  path: Url.pathname+Url.search,
  method: 'POST',
   headers: {
       'Content-Type': 'application/json',
       'Content-Length': data==undefined?0:data.length
     }
     
};
console.log("requesting resource:"+Url.host+Url.pathname+":443");
var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      console.log(chunk);
      if(typeof(callback)=="function")
      {
        var ret=callback(chunk,res.statusCode)
          if(ret!=undefined){
            return ret;
          }
      }
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.write(data);
req.end();
}

//this function will verify the OAuth token is valid
exports.validateOAuth=function(oAuth,callback){
var options = {
  host: 'id.twitch.tv',
  port: 443,
  path: '/oauth2/validate',
  method: 'GET',
  headers:{
      'Authorization':'OAuth '+oAuth
  }
};
console.log("requesting resource:https://id.twitch.tv/oauth2/validate:443");
var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      console.log(chunk);
      if(typeof(callback)=="function"){
          
          var ret=callback(chunk,res.statusCode)
          if(ret!=undefined){
            return ret;
          }
      }
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

}