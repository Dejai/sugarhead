document.addEventListener("DOMContentLoaded", function(){
	var audio = document.getElementById("currentAudio");
	var audioSource = document.getElementById("currentSong");
	var songID = location.search.split("=")[1];
	if (songID === undefined){
		// console.log("Couldn't get the songID");
		document.write("Hi");
	} else {
		// songID = "1Ep06z-rxOrbKPSJnzb814O7ZQUaN_x75";
		songID = decodeURIComponent(songID).replace(/&amp;/g, '&');
		var sourceURL = "http://docs.google.com/uc?export=open&id=" + songID; 
		audioSource.src = sourceURL;
		audio.load();
		audio.onloadeddata = function(){
			document.write(Math.round(audio.duration))
		}
	}
});