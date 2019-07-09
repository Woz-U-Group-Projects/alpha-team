var url=require("url");
var https=require("https");
var key1=process.env.key1;
var engine=process.env.engine
var key2=process.env.key2;
var debug=false;
exports.getSSL=function(Url, callback){  
      Url=url.parse(Url,true);
      var qdata=Url.query;
     
      
  var options = {
    host: Url.host,
    port: 443,
    path: Url.pathname+Url.search,
    method: "GET"
  };
  console.log("requesting resource:"+Url.host+Url.path);
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var __data="";
    res.on('data', function (chunk) {
      __data+=chunk;
    });
    res.on('end', function(){
        if(typeof(callback)=="function")
      callback(__data);
    });
  });
  
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();
  
  }
  exports.getVideoURL=function(search,callback){
     // callback("https://www.youtube.com/watch?v=SRwrg0db_zY");
     
  var index=-1;
  if(debug==false){
  exports.getSSL("https://www.googleapis.com/customsearch/v1?key="+key1+"&cx="+engine+"&q="+encodeURIComponent(search),function(data){
    index=data.indexOf("https://www.youtube.com/watch?v=",index+1);
    //console.log("index: "+index)
    if(index!=-1){
    _url=data.slice(index,index+43);
    //console.log(_url);
    if(typeof(callback)=="function")
    callback(_url);
}
else{
    console.log("song was not found.");
}
    });
  }
  else
  {
    callback("https://youtube.com/watch?v=SRwrg0db_zY");
  }
    
}
 // example using getVideoURL():
/** /exports.getVideoURL("I wanna rock",function(songUrl){
console.log(songUrl);
});
//*/
exports.getVideoDetails=function(Url,callback){
    Url=url.parse(Url,true);
    qdata=Url.query;
    if((Url.host=="youtube.com"||Url.host=="www.youtube.com") && qdata.v){
        let videoId=qdata.v;
        if(debug==false){
exports.getSSL("https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics%2Csnippet&key="+key2+"&id="+videoId,function(_data){
//_data={ "kind": "youtube#videoListResponse", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/y0nEUuwIWmyaw1-QiApDdOI3oNg\"", "pageInfo": { "totalResults": 1, "resultsPerPage": 1 }, "items": [ { "kind": "youtube#video", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/VtGjf2TnUCvZ6seY_uQd84MWOqE\"", "id": "SRwrg0db_zY", "snippet": { "publishedAt": "2010-08-04T00:57:48.000Z", "channelId": "UCRay0Axn67v8-nm6n91uBsg", "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/", "thumbnails": { "default": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/default.jpg", "width": 120, "height": 90 }, "medium": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/mqdefault.jpg", "width": 320, "height": 180 }, "high": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/hqdefault.jpg", "width": 480, "height": 360 } }, "channelTitle": "Twisted Sister", "tags": [ "Twisted Sister", "I Wanna Rock", "Rock", "Glam Rock", "official", "music video", "music", "video", "French", "Eddie", "Fingers", "Ojeda", "Snider", "Mark", "The Animal", "Mendoza", "Pero", "Dee Snider", "Rock of Ages", "Jay Jay French", "Metal" ], "categoryId": "10", "liveBroadcastContent": "none", "localized": { "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/" } }, "contentDetails": { "duration": "PT4M34S", "dimension": "2d", "definition": "sd", "caption": "false", "licensedContent": true, "projection": "rectangular" }, "statistics": { "viewCount": "58819620", "likeCount": "365976", "dislikeCount": "12501", "favoriteCount": "0", "commentCount": "22013" } } ] };_data=JSON.stringify(_data);
_data=JSON.parse(_data);
id=_data.items[0].id;
title=_data.items[0].snippet.title;
length=_data.items[0].contentDetails.duration;
views=_data.items[0].statistics.viewCount;
likeCount=_data.items[0].statistics.likeCount;
dislikeCount=_data.items[0].statistics.dislikeCount;
seconds=0;
if(length.split("H").length!=1)
{
seconds=length.slice(2).split("H")[0]*3600+length.slice(2).split("H")[1].split("M")[0]*60+length.slice(2).split("H")[1].split("M")[1].split("S")[0]*1;
}
else if(length.split("M").length!=1)
{
seconds=length.slice(2).split("M")[0]*60+length.slice(2).split("M")[1].split("S")[0]*1;
}
else if(length.split("S").length!=1)
{
seconds=length.slice(2).split("S")[0]*1;
}
ret_data={"id":id,"title":title,"length":seconds,"views":views,"likeCount":likeCount,"dislikeCount":dislikeCount};
console.log(JSON.stringify(ret_data));
if(typeof(callback)=="function")
{

    callback(ret_data);
}
});
        }
        else
        {
_data={ "kind": "youtube#videoListResponse", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/y0nEUuwIWmyaw1-QiApDdOI3oNg\"", "pageInfo": { "totalResults": 1, "resultsPerPage": 1 }, "items": [ { "kind": "youtube#video", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/VtGjf2TnUCvZ6seY_uQd84MWOqE\"", "id": "SRwrg0db_zY", "snippet": { "publishedAt": "2010-08-04T00:57:48.000Z", "channelId": "UCRay0Axn67v8-nm6n91uBsg", "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/", "thumbnails": { "default": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/default.jpg", "width": 120, "height": 90 }, "medium": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/mqdefault.jpg", "width": 320, "height": 180 }, "high": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/hqdefault.jpg", "width": 480, "height": 360 } }, "channelTitle": "Twisted Sister", "tags": [ "Twisted Sister", "I Wanna Rock", "Rock", "Glam Rock", "official", "music video", "music", "video", "French", "Eddie", "Fingers", "Ojeda", "Snider", "Mark", "The Animal", "Mendoza", "Pero", "Dee Snider", "Rock of Ages", "Jay Jay French", "Metal" ], "categoryId": "10", "liveBroadcastContent": "none", "localized": { "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/" } }, "contentDetails": { "duration": "PT4M34S", "dimension": "2d", "definition": "sd", "caption": "false", "licensedContent": true, "projection": "rectangular" }, "statistics": { "viewCount": "58819620", "likeCount": "365976", "dislikeCount": "12501", "favoriteCount": "0", "commentCount": "22013" } } ] };_data=JSON.stringify(_data);
_data=JSON.parse(_data);
id=_data.items[0].id;
title=_data.items[0].snippet.title;
length=_data.items[0].contentDetails.duration;
views=_data.items[0].statistics.viewCount;
likeCount=_data.items[0].statistics.likeCount;
dislikeCount=_data.items[0].statistics.dislikeCount;
seconds=0;
if(length.split("H").length!=1)
{
seconds=length.slice(2).split("H")[0]*3600+length.slice(2).split("H")[1].split("M")[0]*60+length.slice(2).split("H")[1].split("M")[1].split("S")[0]*1;
}
else if(length.split("M").length!=1)
{
seconds=length.slice(2).split("M")[0]*60+length.slice(2).split("M")[1].split("S")[0]*1;
}
else if(length.split("S").length!=1)
{
seconds=length.slice(2).split("S")[0]*1;
}
ret_data={"id":id,"title":title,"length":seconds,"views":views,"likeCount":likeCount,"dislikeCount":dislikeCount};
console.log(JSON.stringify(ret_data));
if(typeof(callback)=="function")
{

    callback(ret_data);
}
        }
    }
    
}
