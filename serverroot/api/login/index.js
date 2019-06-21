var url= require('url');
var twitch= require('../../../twitch.js');
var cookie=require('../../../cookie.js');
var mysql = require('../../../mysql.js');
function getQuery(req,query,equals){
    query=query.toLowerCase();
    var urlQuery;
    if(req.url!=undefined){
    urlQuery=url.parse(req.url,true).query;console.log(urlQuery);
    }
    else{
        urlQuery=req.query;
    }
    var searchQuery=JSON.parse(JSON.stringify(urlQuery).toLowerCase());
    if(searchQuery[query]){
        var temp="";
        for(i=0;i<query.length;i++){
    temp+=JSON.stringify(urlQuery)[JSON.stringify(searchQuery).search(query)+i];
        }
        if(equals){
            return urlQuery[temp].toLowerCase()==equals.toLowerCase();
        }
        return urlQuery[temp];
    }
    
    else return false;
}
exports.start=function(req,res){
    var Url=url.parse(req.url,true);//gets url
    var query=Url.query;//gets the queries in the url
    var request;
    var redirect_uri="http://localhost/api/login";
    var client_id=process.env.client_id;
    console.log(query);
    if(req.method=="GET"){
    if(request=getQuery(req,"request"))//if query getTest is not undefined it exists example: localhost/api?getTest=1 and the value is stored in the query[name_of_query]
    {
        request=request.toLowerCase();
        console.log("request");
        
        if(request=="twitchauthlink")
        {
            if(getQuery(req,"redirect")){
                res.writeHead(302, {'Location': 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=user_read&force_verify=true'});
            res.end();
            }
            else
            {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=user_read&force_verify=true');
            }
        }
        else
        if(request=="isloggedin"){
            if(cookie.isCookie(req,"oauth") && cookie.isCookie(req,"nick")){
                username=cookie.getCookie(req,"nick");
                console.log("request isloggedin stored in cookie user:"+username)
                //twitch.validateOAuth
                twitch.validateOAuth(cookie.getCookie(req,"oauth"),function(result,status){
                    json=JSON.parse(result);
                if(status==200 && json["login"].toLowerCase()==username.toLowerCase()){
                    var user=getQuery(req,"user");
                if(!user || user.toLowerCase()==username.toLowerCase()){
                    res.writeHead(200, {'Content-Type': 'text/plain'});
             res.write("true");
             res.end();
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("false");
             res.end();
                }
            }
            else if(status==401){
                if(result.message!=undefined){
                    if(result.message=="invalid access token"){
                        cookie.removeCookie(req,"nick");
                        cookie.removeCookie(req,"oauth");
                        cookie.endSession();
                    }
                }

            }
            else 
            {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write("false");
                res.end();   
            }
            });
        }
            else
            {
                res.writeHead(200, {'Content-Type': 'text/plain'});
             res.write("false");
             res.end();   
            }
        
    
        }
        else{
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("error 404");
            res.end();
        }
    }

else
    
    if((code=query["code"])!=undefined && typeof(code)=="string"){
        var client_secret=process.env.client_secret;
        var OAuth;
        
        var username;
        var data = JSON.stringify({client_id: client_id,client_secret: client_secret,grant_type: 'authorization_code',redirect_uri: redirect_uri,code: code});
        var sentResponse=false;
        twitch.postSSL("https://api.twitch.tv/kraken/oauth2/token",data,function(result,status){
            if(status==200){
            json=JSON.parse(result);
           OAuth=json['access_token'];  
           console.log("OAuth:"+OAuth);   
        
        twitch.validateOAuth(OAuth,function(result,status){
            if(status==200){
            json=JSON.parse(result);
            username=json["login"];
            if(cookie.isCookie(req,"oauth"))
            cookie.updateCookie(req,"oauth",OAuth);
            else
            cookie.addCookie(req,"oauth",OAuth);
            if(cookie.isCookie(req,"nick"))
            cookie.updateCookie(req,"nick",username);
            else
            cookie.addCookie(req,"nick",username);
            cookie.save(req);
            console.log("OAuth:"+cookie.getCookie(req,"oauth")+"\nNICK: "+cookie.getCookie(req,"nick")); 
            //todo invalidate previous oauth token
            mysql.getOauth(username,function(old_auth){
                console.log("old_auth:"+old_auth);
            data = JSON.stringify({client_id: client_id, access_token: old_auth});
            if(old_auth!=undefined){
            twitch.postSSL("https://id.twitch.tv/oauth2/revoke?client_id="+client_id+"&token="+old_auth,"",function(response){
                console.log("revoke data:"+data);
             console.log(response);
            });
         }
         
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
        }
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
    else
    {
        res.write("error 404");
        res.end();  
    }
}
    else if(req.method=="POST"){
        if(getQuery(req,"request","getloggedinuser")){
            if(cookie.isCookie(req,"nick")&&cookie.isCookie(req,"oauth")){
            twitch.validateOAuth(cookie.getCookie(req,"oauth"),function(_result,status){
            if(status==200){
                res.writeHead(200,{"Content-Type":"text/plain"});
            res.end(cookie.getCookie(req,"nick"));
            }
            else if(status==401&&_result.message=="invalid access token"){
                cookie.removeCookie(req,"nick");
                cookie.removeCookie(req,"oauth");
                cookie.save();
                cookie.endSession();
                res.writeHead(403,{"Content-Type":"text/plain"});
                res.end("User not logged in.");

            }
            else{
            res.writeHead(403,{"Content-Type":"text/plain"});
            res.end("User not logged in.");
            }
        });

    }
    else{
        res.writeHead(403,{"Content-Type":"text/plain"});
        res.end("User not logged in.");
        }

        }
        else
        {
            res.writeHead(404,{"Content-Type":"text/plain"});
            res.write("page not found");
            res.end();
        }
        
        
    }
    else{
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.write("page not found.");
        res.end();
    }
}  
