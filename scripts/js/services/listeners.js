angular.module("sugarApp").service("listeners", function(musicPlayer){

	this.startListening = function(){
		beforeYouGo();
		keyboardListener();
		songEnded();
		// musicPlayer.repeat();
	}

	this.sendControl = function(event){
		audioControl(event); 
	}

	var songEnded = function(){
		currentAudio.addEventListener("ended", function(){
			musicPlayer.changeSong("next");
		});
	}

	var audioControl = function(event){
		switch(event){
			case "play":
				musicPlayer.playSong();
				break;
			case "pause":
				musicPlayer.pauseSong();
				break;
			case "next":
				musicPlayer.changeSong("next");
				break;
			case "prev":
				musicPlayer.changeSong("prev");
				break;
			case "shuffle":
				musicPlayer.shuffle();
				break;
			case "repeat":
				musicPlayer.repeat();
				break;
			case "preScroll":
				psuedoPaused = true;
				break;
			case "scroll":
				currentAudio.currentTime = document.getElementById("range2").value;
				var valu = parseInt((document.getElementById("range2").value), 10);
				musicPlayer.setScroll(valu);
				musicPlayer.setTimeWhileScroll();
				break;
			case "postScroll":
				currentAudio.currentTime = document.getElementById("range2").value;
				psuedoPaused = false;
				break;
			default:
				musicPlayer.pauseSong();
		}
	}

	var keyboardListener = function(){
		window.onkeyup = function(event){
			if (!(document.getElementById("searchBox") === document.activeElement) ){
				switch (event.which){
					case 37:   //left arrow
						audioControl("prev");
						break;
					case 39:   // right arrow
						audioControl("next");
						break;
					case 32:   // space bar
						if(currentAudio.paused){
							audioControl("play");
						} else {
							audioControl("pause");
						}			
						musicPlayer.findCurrentSong();		
						break;
					case 83:  // S button
						audioControl("shuffle");
						break;
					case 82:  // r button
						audioControl("repeat");
						break;
					case 67:  // c button
						musicPlayer.findCurrentSong();
						break;
					case 38:  // up arrow
					case 40:  // down arrow
						event.preventDefault();
						break;
					default:
				}
			}
	    }
	}

	var beforeYouGo = function(){
		window.addEventListener("beforeunload", function(event){
			var src1 = document.getElementById("currentSong_mp3").src; 
			var src2 = document.getElementById("currentSong_mp4").src;
			if (typeof(Storage) !== "undefined" && (src1 || src2)){
				var trueSource = src1 ? src1 : src2;
				localStorage.leftOff = true;
				localStorage.lastMonth = new Date().getMonth()+1;
				localStorage.lastDay = new Date().getDate();
				localStorage.lastTrack = decodeURIComponent(trueSource.substring(trueSource.lastIndexOf("/")+1));
				localStorage.lastTime = currentAudio.currentTime-2;
			} else {
				localStorage.leftOff = false;
			}
		}, true);
	}




});