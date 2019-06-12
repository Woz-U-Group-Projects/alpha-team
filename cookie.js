var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
/*
//waiting for mysql.js
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'session_test',
    password: 'password',
    database: 'session_test'
};
 
var sessionStore = new MySQLStore(options);*/
exports.addCookie=function(req,name,value){
if(req.session[name]==undefined){
req.session[name]=value;
return true;
}
return false;
}
exports.getCookie=function(req,name){
  return req.session[name];
}
exports.isCookie=function(req,name){
  console.log(name+":"+req.session[name]);
  if(req.session[name]!=undefined)
  {
    return true;
  }
  return false;
}
exports.updateCookie=function(req,name,value){
  if(req.session[name]!=undefined){
    req.session[name]=value;
    return true;
  }
  return false;
}
exports.removeCookie=function(req,name,value){
  if(req.session[name]!=undefined){
    req.session[name]=undefined;
    return true;
  }
  return false;
}
exports.setCookie=function(req,name,value){
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
exports.start=function(app){
app.use(cookieParser());
app.use(session({
    secret: "cookie_secret",
    name: "session",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
}
exports.save=function(req){
  req.session.save();
}
