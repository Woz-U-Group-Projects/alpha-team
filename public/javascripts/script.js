 // Load the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/player_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // Replace the 'ytplayer' element with an <iframe> and
 // YouTube player after the API code downloads.
 var player;
 function onYouTubePlayerAPIReady() {
   player = new YT.Player('ytplayer', {
     height: 'auto',
     width: '100%',	
                            
     playerVars:{
         enablejsapi: 1,
 listType:'playlist',
         list: 'PLDr_4M2flXJlRLzruodOncrsz33omi3zp', //put playlist ID HERE <-----------------
         autoplay: 1,
       controls: 0,
       loop: 1,
       cc_load_policy: 1,	//this fails to work . . . 
       cc_lang_pref: 'en',
       iv_load_policy: 3,
     }
     
   });			    
 }

 
	/** var txt = '{"queue":"1", "title":"I wanna rock", "songURL":"https://www.youtube.com/watch?v=SRwrg0db_zY"}'
	var obj = JSON.parse(txt);
	document.getElementById("ID").innerHTML = obj.queue;
	document.getElementById("TITLE").innerHTML = obj.title;
	document.getElementById("URL").innerHTML = obj.songURL;
*/

