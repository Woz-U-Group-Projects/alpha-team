//when reseting passwords use this format
//ALTER USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "alpha",
  password: "password",
  database: "songrequest"
});
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
exports.test=function(){
  con.query("select * from test", function (err,result,fields){
    console.log(result);
  });
}
exports.createOAuthTable=function(){
 
 
    con.query("create table oAuth(auth varchar(80),nick varchar(25))", function (err,result,fields){
      console.log(result);
    });
  
}
exports.createSongRequestTable=function(channel){


    con.query("create table "+channel+"_songList(id int AUTO_INCREMENT, requestedBy VARCHAR(25) NOT NULL, songURL VARCHAR(80) UNIQUE NOT NULL)", function (err,result,fields){
      console.log(result);
    });
}
exports.tableExists=function(table,callback){
  
      con.query("select count(*) as found from information_schema.tables where table_schema='songrequest' and table_name='"+table+"'", function (err,result,fields){
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
    con.query("select auth from oauth where nick='"+user+"'", function (err,result,fields){
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
      con.query("update "+table +" set "+updateCol+"='"+newVal+"' where "+columns+"='"+value+"'", function (err,result,fields){
        if(err) throw err;
        console.log(result);
      });
      
    }
  }
  exports.insertIntoTable=function(table,columns,value){
    
     var temp="";
     if((typeof(columns)=="string" && typeof(value)=="string" && columns.split(",").length==value.split(",").length)   ||   (typeof(value)=="object" && typeof(value[0][0])=="string" && columns.split(",").length==value[0].length)){
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

     temp="";
     for(i=0;i<columns.length;i++){
      if(columns[i]!=" ")
      {
        temp+=columns[i];
      }
    }
    columns=temp;
    temp="";
      console.log("columns: "+columns);
      console.log("value: "+value);
      
      con.query("insert into "+table +"("+columns+") values ?", [value], function (err,result,fields){
        console.log(result);
      });
      
    }
  }


