var url=require('url');
function getQuery(req,query,equals){
    query=query.toLowerCase();
    var urlQuery=url.parse(req.url,true).query;console.log(urlQuery);
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

    if(getQuery(req,"test","Hi")){
        console.log("Hi back");
    }


res.writeHead(200);
res.write("test");
res.end();
} 