import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './login';
import * as serviceWorker from './serviceWorker';
function getCookie(cookie){
    document.cookie.indexOf(cookie);
    let length=document.cookie.split("; ").length;
    for(let i=0;i<length;i++){
    if(document.cookie.split("; ")[i].split("=")[0]==cookie)
    return document.cookie.split("; ")[i].split("=")[1];
    
    }
}
    function getUser(){
        fetch("http://localhost/api/login?request=getloggedinuser",
        {
            credentials: "include",
            method: "POST"
        })
        .then((res) =>  res.text()) 
        .then(function(result){
		if(result!="User not logged in.")
        {
            console.log("user is logged in, setting cookie");
            console.log("display_name: "+result);
			document.cookie="display_name="+result;
        }
else
{
console.log("if user is not logged in");
}
        //result=result=="true"; 
        console.log(result)})
                       
        
        .catch(function(res){ console.log(res) }) 
    
}


    function requestSong(song,channel){
        let display_name=getCookie("display_name");
        let body=undefined;
        if(!song.indexOf("youtube.com/watch?v=")==-1)
        {
            body=JSON.stringify({"requestedBy":display_name, "title":song});
        }
        else{
            body=JSON.stringify({"requestedBy":display_name, "url":"https://www."+song.slice(song.indexOf("youtube.com/watch?v="),song.indexOf("youtube.com/watch?v=")+31)})
        }
        if(body){
        fetch("http://localhost/api/songqueue?request=insertsong&channel="+channel,
        {
            credentials: "include",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: body
        })
        .then((res) =>  res.text()) 
        .then(function(result){
        //result=result=="true";
        console.log(result)})
                       
        
        .catch(function(res){ console.log(res) }) 
    }
}

var request=new XMLHttpRequest();
fetch("http://localhost/api/login?request=isloggedin",{
  credentials: "include"
})
.then((resp) => resp.text())
.then(function(data){
    if(data!="true")
    {
        displayLogin();
    }
    else{
        console.log("You are logged in");
        getUser();
        displayContent();

    }
    console.log(data)})

function displayLogin(){
ReactDOM.render(<Login />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
}
function displayContent(){

}
