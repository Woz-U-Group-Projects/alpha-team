//to create user use this format
//CREATE USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
//when reseting passwords use this format
//ALTER USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
var mysql = require('mysql');
var con = mysql.createPool({
  host: "localhost",
  user: "alpha",
  password: "password",
  database: "songrequest"
});
exports.test=function(){
  con.query("select * from test", function (err,result,fields){
    console.log(result);
  });
}
exports.createOAuthTable=function(){
  if(exports.tableExists("oAuth",function(_exists){
    if(!_exists){
    con.query("create table oAuth(auth varchar(80),nick varchar(25))", function (err,result,fields){
      console.log(result);
    });
  }
}));
}
exports.createSongRequestTable=function(channel){
  if(exports.tableExists(channel+"_songList",function(_exists){
    if(!_exists){
    var query=con.query("create table "+mysql.escapeId(channel+"_songList")+" (id int key AUTO_INCREMENT, queue int unique not null, requestedBy VARCHAR(25) NOT NULL, title varchar(100) NOT NULL, length int NOT NULL, views int NOT NULL, likeCount int not null, dislikeCount int not null, songURL VARCHAR(80) UNIQUE NOT NULL)", function (err,result,fields){
      console.log(query.sql);
    
    });
  }
  }));
}
exports.getSongs=function(table,callback){
  con.query("select queue,title,length,likeCount,dislikeCount,songURL,requestedBy from "+mysql.escapeId(table+"_songList"),function(err,result){
    if(err)throw err;
    if(typeof(callback)=="function")
    callback(result);
  });
}
exports.getQueue=function(table,callback){
  con.query("select count(*) as count from "+mysql.escapeId(table+"_songList"),function(err,result){
    if(err)throw err;
    if(typeof(callback=="function"))
    callback(result[0].count+1);
  });
}
exports.getRequesterFromQueue=function(table,queue,callback){
  con.query("select requestedBy from "+mysql.escapeId(table+"_songList")+" where queue=?",queue,function(err,result){
    if(err)throw err;
    if(typeof(callback=="function")){
      if(typeof(result[0])!="undefined")
      callback(result[0].requestedBy);
      else
      callback();
    }
    if(typeof(result[0])!="undefined")
    console.log("mysql.js getRequesterFromQueue() requested by: "+result[0].requestedBy);
    else
    console.log()
  });
}
exports.deletefromQueue=function(table,deleteInitiatedBy,deleteQueue,callback){
  exports.getRequesterFromQueue(table,deleteQueue,function(requestedBy){
    if(requestedBy==deleteInitiatedBy||table==deleteInitiatedBy){
      con.query("delete from "+mysql.escapeId(table+"_songList")+" where queue=?",deleteQueue,function(err,result){
        if(err) throw err;
        con.query("update "+mysql.escapeId(table+"_songList")+" set queue=queue-1 where queue>? order by queue asc",deleteQueue,function(error){
          if(error)throw error;
        
        if(typeof(callback=="function"))
        callback(result.affectedRows==1);
      });
    });
    }
    else
    {
      if(typeof(callback=="function"))
      callback(undefined);
    }
  })
}
exports.popFromQueue=function(table){
con.query("delete from "+mysql.escapeId(table+"_songList")+" where queue=1",function(err){
  if(err)throw err;
  con.query("update "+mysql.escapeId(table+"_songList")+" set queue=queue-1 order by queue asc",function(error){
    if(error)throw error;
  });
});

}
exports.tableExists=function(table,callback){
      con.query("select count(*) as found from information_schema.tables where table_schema='songrequest' and table_name=?",[table], function (err,result,fields){
        console.log(result[0].found==1);
        if(typeof(callback)=="function")
        {
        callback(result[0].found==1);
        }
      });

}
exports.getOauth=function(user,callback){
   exports.tableExists("oauth",function(_exists){
     if(_exists && user!=undefined){
    con.query("select auth from oauth where nick=?",[user], function (err,result,fields){
      console.log(result);
      if(typeof(callback)=="function"){
        result[0]!=undefined?callback(result[0].auth):callback();
      }
    });
  }
  else{
    if(typeof(callback)=="function"){
      callback();
      }
  }
  });
}
  exports.updateTable=function(table,updateCol,newVal,columns,value)
  {
     if(typeof(columns)=="string" && typeof(value)=="string"){    
     //console.log("mysql statement:");
      //console.log("update "+table +" set "+updateCol+"='"+newVal+"' where "+columns+"='"+value+"'");
      con.query("update ?? set ??=? where ??=?",[table,updateCol,newVal,columns,value], function (err,result,fields){
        if(err) throw err;
        console.log(result);
      });
      
    }
  }
  exports.insertIntoTable=function(table,columns,value,callback){
     var temp="";
     if((typeof(columns)=="string" && typeof(value)=="string" && columns.split(",").length==value.split(",").length)   ||   (typeof(value)=="object" && (typeof(value[0][0])=="string" || typeof(value[0][0])=="number") && columns.split(",").length==value[0].length)){
     if(typeof(value)=="string" && typeof(columns)=="string" ){
    
     for(i=0;i<value.length;i++){
       if(value[i]!=" " || (i>0 && value[i-1]!=",") && (i<value.length && value[i+1]!=","))
       {
         temp+=value[i];
       }
     }
     temp=temp.split(",");
     value=[];
     value[0]=temp;
  }
  else{
    console.error("Error: number of columns and values do not match.");
  }

     temp="";
     for(i=0;i<columns.length;i++){
      if(columns[i]!=" ")
      {
        temp+=columns[i];
      }
    }
    columns=[];
    columns[0]=temp.split(",");
    temp="";
      console.log("columns: "+columns);
      console.log("value: "+value);
      
      con.query("insert into ??(??) values ?", [table,columns,value], function (err,result,fields){
        if(err) throw err;
        if(typeof(callback)=="function"){
          if(result!=undefined)
          callback(result.affectedRows==1)
          else
          callback(undefined);
        }
        console.log(result);
      });
      
    }
    else
    {
      console.log("error check that your columns and values match.");
      for(i=0;i<value[0].length;i++)
      {
        console.log(value[0][i]);
      }
    }
  }