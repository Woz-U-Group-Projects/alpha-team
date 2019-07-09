import fetch from 'isomorphic-fetch'

export function fetchPopularRepos (language = 'all') {
  const encodedURI = encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

  return fetch(encodedURI)
    .then((data) => data.json())
    .then((repos) => repos.items)
    .catch((error) => {
      console.warn(error)
      return null
    });
}

export function isLoggedin()
{
return fetch("http://localhost/api/login?request=isloggedin",{
credentials: "include"
})
.then((data) => data.text())
.then((loggedin) => loggedin)
.catch(function(error){
  console.warn(error)
  return null
});
}
export function getUser(cookie,query){
  console.log("query in api.js function getUser: "+JSON.stringify(query));
  return fetch("http://localhost/api/login?request=getloggedinuser",
  {
    headers:{cookie:cookie},
    method:"POST",
    credentials: "include"
  })
  .then((data) =>  data.text()) 
  .then((username)=>JSON.parse(JSON.stringify({loggedin:(username!="User not logged in."), username:username, channel:query["channel"]})))
  .catch(function(res){ console.log(res) 
  return null;
  }) 

}