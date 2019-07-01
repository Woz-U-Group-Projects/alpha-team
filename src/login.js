import React from 'react';
import './App.css';
var twitchURL="http://localhost/api/login?request=twitchauthlink&redirect=1";
function login() {
  return (
    <div className="login">
      <header className="login-header">
        <button style={{backgroundColor:"#6441A5",borderColor:"#6D51A0",color:"white"}} onClick={function(){window.location.href=twitchURL}} >Login with Twitch</button>
      </header>
    </div>
  );
}

export default login;
