var express = require('express');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'alpha_sessions',
    password: 'password',
    database: 'sessions'
};
 
var sessionStore = new MySQLStore(options);
exports.getSession=function(SID,callback){
sessionStore.get(SID,function(err,session){
  if(typeof(callback)=="function")
  {
    callback(err,session);
  }
})
}
exports.addCookie=function(req,name,value){ //adds a cookie if it does not exist
if(req.session[name]==undefined){//if it doesn't exist req.session["newCookie"] will equal undefined.
req.session[name]=value; //so we will set the value
return true;//...and return true
}
return false;//otherwise we will return false
}
exports.getCookie=function(req,name){//this will return the value of the cookie
  return req.session[name];//returns value.
}
exports.isCookie=function(req,name){//has this cookie been set already, or does the cookie not exist.
  console.log(+"isSet? "+name+":"+req.session[name]!=undefined);
  return req.session[name]!=undefined;
  
}
exports.updateCookie=function(req,name,value){//updates the value of a cookie if it already exists
  if(req.session[name]!=undefined){//if the cookie has not yet been set before we would be adding a cookie.
    req.session[name]=value;
    return true;
  }
  return false;
}
exports.removeCookie=function(req,name){//deletes cookie
  if(req.session[name]!=undefined){
    req.session[name]=undefined;
    return true;
  }
  return false;
}
exports.setCookie=function(req,name,value){//this is a master function will create, or update the value of a cookie.
    req.session[name]=value;
    return true;
}
exports.endSession=function(req){
req.session.destroy(function(err) {
  if(error)
  {
    return false;
  }
  return true;
});
}
exports.newSession=function(req){
  req.session.regenerate(function(err) {
  if(error)
  {
    return false;
  }
  return true;
});
}
exports.start=function(app){//required code to use cookies takes the express object and tells express we are using session cookies
app.use(session({
    secret: "cookie_secret",
    name: "session",
    proxy: true,
    store:sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie:{httpOnly:false}
}));
}
exports.save=function(req){//in the event we need this for long connections and it might be useful to save a cookie manually, cookies are save automatically at the end of a request.
  req.session.save();
}
