//when reseting passwords use this format
//ALTER USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "alpha",
  password: "password",
  database: "songrequest"
});
exports.test=function(){
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("select * from test", function (err,result,fields){
    console.log(result);
  });
});
}
exports.createOAuthTable=function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("create table oAuth(auth varchar(80),nick varchar(25))", function (err,result,fields){
      console.log(result);
    });
  });
}
  exports.insertToTable=function(table,columns,value){
    
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
     
      
      con.query("insert into "+table +"("+columns+") values ?", [value], function (err,result,fields){
        console.log(result);
      });
    });
  }


