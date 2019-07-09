
import React, { Component } from 'react'
import { isLoggedin } from './api';

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
function displayLogin(){
  ReactDOM.render(<Login />, document.getElementById('root'));
  
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
  }
  function displayContent(){
    ReactDOM.render(<Content />, document.getElementById('root'));
    serviceWorker.unregister();
  }



  class Home extends Component {
    constructor(props) {
      super(props)
  
      let response
      if (__isBrowser__) {
        response = window.__INITIAL_DATA__
        delete window.__INITIAL_DATA__
      } else {
        response = this.props.staticContext.data
      }
      
  
      this.state = {
        response,
        loading: response ? false : true,
      }
  
      this.fetchRepos = this.fetchRepos.bind(this)
    }
    componentDidMount () {
      if (!this.state.response) {
        this.fetchRepos(this.props.match.params.id)
      }
    }
    componentDidUpdate (prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        this.fetchRepos(this.props.match.params.id)
      }
    }
    fetchRepos (lang) {
      this.setState(() => ({
        loading: true
      }))
  
      this.props.fetchInitialData(lang)
        .then((response) => this.setState(() => ({
          response,
          loading: false,
        })))
    }
    render() {
      const { loading, response } = this.state
      if(response){
      let loggedin=response.loggedin;
      let username=response.username;
      let channel=response.channel;
      if(!channel){
        channel=username;
      }
      if (loading === true) {
        return <p>LOADING</p>
      }
      
      if(loggedin){

        if(username==channel){
          return(
            <div>
              Welcome {username}, you are logged in as the channel owner.
            </div>
          )
        }
        else{
       
       return(
  <div>
    Welcome {username}, you are logged in as a normal user.
    </div>
)
       }
    }
    else
    {
      return(
        <div>
          You are not logged in.
        </div>
      )
    }
  }
  else
  {
    return(
      <div>
        <a href="/songlist">Click here to continue</a>
      </div>
    )
  }
 }
  }
  
  export default Home