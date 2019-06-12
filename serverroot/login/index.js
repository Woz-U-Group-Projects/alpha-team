var url= require('url');
var twitch= require('../../twitch.js');
var cookie=require('../../cookie.js');
exports.start=function(req,res){
    var client_id="gxnsm64vnuninzu8f9whol09b82pqx";
var client_secret="el2hj3hhe3wtnrpjzzqrr7cxnehkmu";//this must be kept confidential
var redirect_uri="http://localhost/login";
var code;

   Url=url.parse(req.url,true);
   qdata=Url.query;
if(cookie.isCookie(req,"oauth") && cookie.isCookie(req,"nick")){
    username=cookie.getCookie(req,"nick");
 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write("Thank you "+username+", you are now logged in.");
}

   else if(qdata.code==undefined || qdata.code=="" || qdata.code==null){


       res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<a href="https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=user_read&force_verify=true">Please Click this Link to Authenticate with Twitch</a>');
    return res.end();
    // https://api.twitch.tv/kraken/oauth2/authorize?response_type=code  
   }
   else{
       var OAuth;
       var username;
       code=qdata.code;
       var data = JSON.stringify({client_id: client_id,client_secret: client_secret,grant_type: 'authorization_code',redirect_uri: redirect_uri,code: code});
       twitch.postSSL("https://api.twitch.tv/kraken/oauth2/token",data,function(result){
           json=JSON.parse(result);
          OAuth=json['access_token'];  
          console.log("OAuth:"+OAuth);   
       
       twitch.validateOAuth(OAuth,function(result){
           json=JSON.parse(result);
           username=json["login"];
           cookie.addCookie(req,"oauth",OAuth);
           cookie.addCookie(req,"nick",username);
           cookie.save(req);
           console.log("OAuth:"+OAuth+"\nNICK: "+username);
           //todo invalidate previous oauth token
           //todo insert into database
       });
       });
      
     res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("dynamic webpage");
   }
    return res.end();  
}