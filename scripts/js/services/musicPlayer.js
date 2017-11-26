angular.module("sugarApp").service("musicPlayer", function($interval){
	
	// This is the KEY function that determines what song to load (which has an autoplay associated with it)
	// It accounts for the two major file types & once loaded, runs the static functions related to the playing of a song
	this.loadAndPlaySong = function(row){
		// console.log(row);
		try {
			var albumName = row.dataset.albumName;
			var trackName = row.dataset.trackName;
			highlightSong = albumName+"-"+trackName;
			var src = path + "music/" + albumName + "/" + trackName;
			src = decodeURIComponent(src);
			currentSong_mp3.src = src;
			currentSong_mp4.src = src;
			currentAudio.load();
			currentAudio.currentTime = 0;
			// playVsPause("play");
			setScrollLength(0);
			currentAudio.onloadeddata = function(){
				songSelected = true;
				showCurrentSong(trackName);	
				setTimez();
				viewSelected(row);
				playVsPause("play");
			}
		} catch (err) {
			console.log(err);
		} finally {
			// console.log("riddim again!");
		}
					
	}

/* INSTANCE FUNCTIONS*/

	// This one controls playing a song (including randomization if none is selected)
	this.playSong = function(){
		if (!songSelected){
			var tableBody = document.getElementById("songsList");
			var randomSong = tableBody.children[Math.floor(Math.random()*tableBody.children.length)];
			this.loadAndPlaySong(randomSong);
		} else{
			currentAudio.play();
			playVsPause("play");
		}
	}
	// This one is simply for pausing the current song;
	this.pauseSong = function(){
		currentAudio.pause();
		playVsPause("pause");
	}
	// This is a LOGIC based one that determines which song to play next;
	// Accounts for both 'next' and 'prev' as well as 'shuffle' and 'repeat'
	this.changeSong = function(direction){
		var highlighted = document.querySelectorAll("[data-song-selected='true']");
		var currentListedSongs = document.getElementById("songsList").children;

		if (currentAudio.currentTime > 4 && direction == "prev" || repeatSong){   // Restart song if it has been playing at least 4 seonds
			this.restartSong();
		} else if (shuffleSongs){
			var randNum = Math.floor(Math.random()*currentListedSongs.length);
			this.loadAndPlaySong(currentListedSongs[randNum]);
		} else if (currentListedSongs.length == 1){  // Then check if there is only one song to view anyway
			this.loadAndPlaySong(currentListedSongs[0]);
		} else{
			// var index; 
			if (highlighted.length > 0){
				var x = 0;
				while ( !(currentListedSongs[x] === highlighted[0])  ){  // This is needed to find the index of the highlighted
					x++;
					if (x > 1000){
						x = 0;
						break;
						console.log(" \"Manual break\" ");
					}
				}
				if (direction == "next"){
					var index = (x+1 == currentListedSongs.length-1) ? 0 : x+1;
				} else{
					var index = (x-1 < 0) ? currentListedSongs.length-2 : x-1;
				}
			} else {
				var index = (direction == "next") ? 0 : currentListedSongs.length-2;
			}
			this.loadAndPlaySong(currentListedSongs[index]);
		}
	}
	// A simple function to go back to the start of a song.
	this.restartSong = function(){
		currentAudio.currentTime = 0;			
	}
	// This toggles the shuffle status. If 'true', the songs will be randomized. 
	this.shuffle = function(){
		var shuffleButton = document.getElementById("shuffleButton");
		shuffleButton.blur();
		shuffleButton.style.color = shuffleSongs ? "initial" : "limegreen";
		shuffleSongs = !shuffleSongs;
	}
	// This toggles the repeat status. If 'true', the current song will repeat;
	this.repeat = function(){
		var repeatButton = document.getElementById("repeatButton");
		repeatButton.blur();
		repeatButton.style.color = repeatSong ? "initial" : "limegreen";
		repeatSong = !repeatSong;
	}
	
	// This dynamically sets the scroll position and the related "fill-in" of where the song is
	this.setScroll = function(value){
		setScrollLength(value);
	}
	var setScrollLength = function(value){
		var input = document.getElementById('range2');
		input.value = value;
		var max = input.max;
		var min = input.min; 
		var range = max - min; 
		var w = parseInt(input.clientWidth, 10);
		var t = ~~(w * (parseInt(input.value, 10) - min) / range);
		document.getElementById("preBar").style.width = t + "px";
	}

	this.findCurrentSong = function(){
		viewSelected();
	}

	this.setTimeWhileScroll = function(){
		currentTime.innerHTML = formatTime(currentAudio.currentTime);
	}

	/*STATIC METHODS */

	var cleanTrackName = function(track){
		return track.substring(2).replace(/.mp3/g, '').replace(/.m4a/g, '').trim()
	}


	// This controls the scrolling of the song into view if it is not
	var viewSelected = function(row){
		if (!row){
			if (document.querySelectorAll("[data-song-selected='true']").length > 0 ){
				document.querySelectorAll("[data-song-selected='true']")[0].scrollIntoView({behavior:"smooth"});
			}
		} else {
			row.scrollIntoView({behavior:"smooth"});
		}
		
	}
	
	// This triggers the $scope based functions to set the song duration and the start the song interval call
	var setTimes = function(){
		document.getElementById("durationTime").click();
		document.getElementById("currentTime").click();
	}


	// TAKEN FROM ANGULARSugar.js file

	var setTimez = function(){
		var currentTime = document.getElementById("currentTime")
		var durationTime = document.getElementById("durationTime")
		
		durationTime.innerHTML = formatTime(currentAudio.duration);
		currentTime.innerHTML = formatTime(0);
		$interval(function(){
			// I added a pseudoPaused variable here that stops this loop from adjusting the scroll bar if a user is currently changing it
			// This allows a user to smoothly scroll that bar without hindering the song, or without being annoyed by the fact that the scroll would re-adjust itself
			if(!currentAudio.paused && !psuedoPaused){
				currentTime.innerHTML = formatTime(currentAudio.currentTime);
				var valu = parseInt((currentAudio.currentTime+1), 10);
				setScrollLength(valu);
			}
		}, 1000);

	}
	var formatTime = function(value){

		var min, secs, playTime; 
		min = Math.floor(value / 59);
		secs = Math.round(value % 59);
		if (secs < 10){
			secs = "0" + secs;
		}
		playTime = min + ":" + secs;
		if (playTime.includes("NaN")){
			return "0:00";
		} else {	
			return playTime
		}
	}
	// This initializes the values for the range input that will correlate with the length of the song
	var showCurrentSong = function(track){
		document.getElementById("songName").innerHTML = cleanTrackName(track);
		document.getElementById("sugarBandNameSection").style.display = "none";
		document.getElementById("currentSongSubSection").style.display = "block";
		document.getElementById("fixedSugarHeadSection").style.display = "block";
		document.getElementById('songScrollContainer').style.display = "block";
		document.getElementById('range2').style.display = "inline-block";
		document.getElementById('range2').value = 0;
		document.getElementById('range2').max = parseInt(currentAudio.duration, 10);
	}
	// This determines which icon to display based on the current playing state of the audio (play vs. pause :) )
	var playVsPause = function(status){
		if (status == "play"){
			document.getElementById("playButton").style.display = "none";
			document.getElementById("pauseButton").style.display = "inline-block";
		} else {
			document.getElementById("playButton").style.display = "inline-block";
			document.getElementById("pauseButton").style.display = "none";
		}
	}
});
