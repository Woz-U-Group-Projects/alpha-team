var url= require('url');
var twitch= require('../../twitch.js');
var cookie=require('../../cookie.js');
var mysql = require('../../mysql.js');
exports.start=function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'});//write head file was found.
    var client_id=process.env.client_id;
var client_secret=process.env.client_secret;//this must be kept confidential
console.log(client_secret);
var redirect_uri="http://localhost/api/login";
var code;

   Url=url.parse(req.url,true);
   qdata=Url.query;

   if((qdata.code==undefined || qdata.code=="" || qdata.code==null)==false){
       var OAuth;
       var username;
       code=qdata.code;
       var data = JSON.stringify({client_id: client_id,client_secret: client_secret,grant_type: 'authorization_code',redirect_uri: redirect_uri,code: code});
       var sentResponse=false;
       twitch.postSSL("https://api.twitch.tv/kraken/oauth2/token",data,function(result,status){
           if(status==200){
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
           mysql.getOauth(username,function(old_auth){
           data = JSON.stringify({client_id: client_id, access_token: old_auth});
           if(old_auth!=undefined){
           twitch.postSSL("https://id.twitch.tv/oauth2/revoke?client_id="+client_id+"&token="+old_auth,"",function(response){
               console.log("revoke data:"+data);
            console.log(response);
           });
        }
        console.log("old_auth:"+old_auth);
            if(old_auth==undefined){   
           //todo insert into database
           console.log("attempting to insert oauth");
           mysql.insertIntoTable("oauth","auth,nick",OAuth+","+username);
    }
    else{
        console.log("attempting to update oauth");
        mysql.updateTable("oauth","auth",OAuth,"nick",username);
    }
        });
           //end insert into database
                  res.write("dynamic webpage");
                  res.end();
                  sentResponse=true;
                  return false;
       });
            if(sentResponse)
            {
                return false;
            }
           }
           else{
               if(sentResponse)
               {return false;} 
           sentResponse=true;
           res.write("Error server responded with "+status);
            res.end();
            return false;
            
           
           }
       });
   }
   else if(cookie.isCookie(req,"oauth") && cookie.isCookie(req,"nick")){
    username=cookie.getCookie(req,"nick");
    //twitch.validateOAuth
 res.write("Thank you "+username+", you are now logged in.");
 res.end();
}
   else if(qdata.code==undefined || qdata.code=="" || qdata.code==null){


    res.write('<a href="https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=user_read&force_verify=true">Please Click this Link to Authenticate with Twitch</a>');
    sentResponse=true;
    return res.end();
    // https://api.twitch.tv/kraken/oauth2/authorize?response_type=code  
   }
    
}