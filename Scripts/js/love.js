var path = "/sugarhead/"; 
var currentSong_mp3 = document.getElementById("currentSong_mp3");
var currentSong_mp4 = document.getElementById("currentSong_mp4");
var currentAudio = document.getElementById("currentAudio");
var songSelected = false; 
var shuffleSongs = false; 
var repeatSong = false;
var inSearch = false;  
var nextSong, prevSong, playingSong; 
var paused;
var currentTimeInterval, currentScrollInterval;


$(document).ready(function(){
	getAlbumsJSON();
	eventListeners();
	// musicSearch();
});

/*-------GET MUSIC-------*/

	function getAlbumsJSON(){
		// $.get(path+"Scripts/js/albums.json")
		$.get(path+"Scripts/js/newALbums.json")
			.done(function(resp){
				// for (var y =0; y < resp.length * resp.length; y++){
					// for (var x =0; x < resp.length; x++){
					for (var obj in resp){
						// buildList(resp[x]);
						buildList(resp[obj], obj);
						

					}
				// }
			});
	}

	function buildList(payload, albumName){
		for (var q = 0; q < payload.songs.length; q++){
			var row = document.createElement("tr");

			var td1 = document.createElement("td");
			td1.appendChild(document.createTextNode(payload.songs[q].songName.substring(3)));
			var td2 = document.createElement("td");
			td2.appendChild(document.createTextNode( convertToPlayTime(payload.songs[q].songLength)));
			// console.log("Minutes " + Math.floor(payload.songs[q].songLength / 60 ));
			// console.log(":" + payload.songs[q].songLength % 60 );
			var td3 = document.createElement("td");
			// td3.appendChild(document.createTextNode(payload.albumName));
			td3.appendChild(document.createTextNode(albumName));
			var td4 = document.createElement("td");
			td4.appendChild(document.createTextNode(payload.releaseYear));
			row.appendChild(td1);
			row.appendChild(td2);
			row.appendChild(td3);
			row.appendChild(td4);
			// row.setAttribute("data-song", "/projects/sugarhead/music/"+payload.albumName+"/"+payload.songs[q].songName);
			row.setAttribute("data-song-name", payload.songs[q].songName);
			row.setAttribute("data-album-name", albumName);
			row.setAttribute("class", "clickSong");
			row.style.cursor = "pointer";


			$("#songsList").append(row);
		}
		// musicControls();
		eventListeners();
	}


/*-------CONTROLLERS & LISTENERS------*/

	function loadAndPlaySong(row){

		var songName = row.dataset.songName;
		var albumName = row.dataset.albumName;
		$("#songName").empty().text(songName.substring(3));	
		var src = path + "music/" + albumName + "/" + songName + ".mp3";
		var src2 = path + "music/" + albumName + "/" + songName + ".m4a";
		src = decodeURIComponent(src);
		src2 = decodeURIComponent(src2);
		currentSong_mp3.src = src;
		currentSong_mp4.src = src2;
		currentAudio.load();

		currentAudio.onloadeddata = function(){
			var count = 0; 
			songSelected = true;
			eventListeners();
			audioControls("play");

			document.getElementById('songScrollContainer').style.display = "block";
			document.getElementById('range2').style.display = "inline-block";
			document.getElementById('range2').value = "0";
			document.getElementById('range2').max = parseInt(currentAudio.duration, 10);
			rangeColor(document.getElementById('range2'));

			var duration = convertToPlayTime(currentAudio.duration);
			$("#durationTime").text(duration);
			var currentTime = convertToPlayTime(currentAudio.currentTime);
			$("#currentTime").text(currentTime);
			setRepeat(); 
			currentTimeInterval = setInterval(function(){
				if(!currentAudio.paused){
					$("#range2").val(parseInt((currentAudio.currentTime+1), 10));
					setScrollLength();
					setCurrentTime();
				}
			}, 1000);
			
			
		}
		currentAudio.addEventListener("ended", function(){
			highlightCurrentSong(row);
			loadAndPlaySong(nextSong);
		});
		highlightCurrentSong(row);
	}

	function audioControls(action){
		try{
			switch (action){
				case "shuffle":
					var shuffleButton = document.getElementById("shuffleButton");
					var shuffleStatus = shuffleButton.dataset.shuffleStatus;
					shuffleButton.blur();
					if (shuffleStatus == "OFF"){
						shuffleButton.dataset.shuffleStatus = "ON";
						shuffleButton.style.color = "limegreen";
						shuffleSongs = true; 
					} else{
						shuffleButton.dataset.shuffleStatus = "OFF";
						shuffleButton.style.color = "gray";
						shuffleButton.style.backgroundColor = "initial";
						shuffleSongs = false; 
					}
					if (playingSong){
						setNextAndPrevSongs(playingSong);
					}
					break;
				case "repeat":
					var repeatButton = document.getElementById("repeatButton");
					var repeatStatus = repeatButton.dataset.repeatStatus;
					repeatButton.blur();
					if (repeatStatus == "OFF"){
						repeatButton.dataset.repeatStatus = "ON";
						repeatButton.style.color = "limegreen";
						repeatSong = true; 
					} else{
						repeatButton.dataset.repeatStatus = "OFF";
						repeatButton.style.color = "gray";
						repeatButton.style.backgroundColor = "initial";
						repeatSong = false; 
					}
					if (playingSong){
						setRepeat();		
					}
					break;
				case "play":
					if (!songSelected){
						var tableBody = document.getElementById("songsList");
						var randomSong = tableBody.children[Math.floor(Math.random()*tableBody.children.length)];
						 // fullListOfSongs[Math.floor(Math.random()*fullListOfSongs.length)];
						// loadAndPlaySong(randomSong.dataset.albumName, randomSong.dataset.songName);
						loadAndPlaySong(randomSong);
						// highlightCurrentSong(randomSong);
					} else{
						currentAudio.play();
						$("#playButton").hide();
						$("#pauseButton").show();
					}
					break;
				case "pause":
					currentAudio.pause();
					$("#playButton").show();
					$("#pauseButton").hide();
					break;
				case "next":
					if (nextSong){
						loadAndPlaySong(nextSong);
					}
					break;
				case "prev":
					if (prevSong){
						loadAndPlaySong(prevSong);
					}
					break;
				case "scroll":
					var work = document.getElementById("range2");
					var selectedTime = work.value; 
					// selectedTime = (selectedTime / 100) * currentAudio.duration;
					currentAudio.currentTime = selectedTime;
					break;
				default:
					console.log("We've got ourselves a default audio control option!");
			}
		} catch (err){
			alert("Something went wrong!\n" + err);
			console.log(err);
		}
	}

	function eventListeners(){
		$("*").unbind("click");
		$(".clickSong").dblclick(function(){		
			loadAndPlaySong($(this)[0]);
		});

		$(".audioController").click(function(){
			var action = $(this).attr("data-audio-action");
			audioControls(action);
		});

		document.getElementById("range2").addEventListener("click", function(){
			console.log(this.value);
			var selectedTime = this.value; 
			currentAudio.currentTime = selectedTime;
			setScrollLength();
			setCurrentTime();
		});

		$(document).unbind("keydown");
		$(document).keydown(function(event){
			if (!inSearch){
				switch (event.which){
					case 37:   //left arrow
						audioControls("prev");
						break;
					case 39:   // right arrow
						audioControls("next");
						break;
					case 32:   // space bar
						if(currentAudio.paused){
							audioControls("play");
						} else {
							audioControls("pause");
						}					
						break;
					case 38:  // up arrow
					case 40:  // down arrow
						event.preventDefault();
						break;
					default:
				}
			}
	    });

	    $("#searchBox").focus(function(){
	    	inSearch = true;
	    });
	   	$("#searchBox").blur(function(){
	   		$("#resultBox").hide();
	    	inSearch = false; 
	    });

	   	$("*").unbind("keypress");
	   	$("#searchBox").keypress(function(event){
	        var searchText = $(this).val();
	        if (event.which == 13){
	        	if (searchText < 1){
	        		alert("At least one char");
	        		// $("#searchError").show();
	        	} else {
	        		musicSearch(searchText);
	        		// alert(searchText);
	        		// getAccountDetails(searchText);
	        		$(this).blur();
	        	}
	        }
	   	 });

	}



/*-------SUPPLEMENTARY FUNCTIONS-------*/

	function convertToPlayTime(value){
		var min, secs, playTime; 
		min = Math.floor(value / 60);
		secs = Math.round(value % 60);
		if (secs < 10){
			secs = "0" + secs;
		}
		playTime = min + ":" + secs;
		return playTime;
	}

	function highlightCurrentSong(row, scroll){
		$(".selectedRow").each(function(){
			$(this).removeClass("selectedRow");
		});
		row.classList.add("selectedRow");
		playingSong = row; 
		setNextAndPrevSongs(row);
		row.scrollIntoView({behavior:"smooth"});

	}

	function setCurrentTime(){
		var currentTime = convertToPlayTime(currentAudio.currentTime);
		$("#currentTime").text(currentTime);
	}

	function setNextAndPrevSongs(row){
		var tableBody = document.getElementById("songsList");

		if (shuffleSongs){
			prevSong = tableBody.children[Math.floor(Math.random()*tableBody.children.length)];
			nextSong = tableBody.children[Math.floor(Math.random()*tableBody.children.length)];
		} else{
			if (row == tableBody.children[0]){
				prevSong = tableBody.lastChild;
				nextSong = row.nextElementSibling;
			} else if (row == tableBody.children[tableBody.children.length-1]){
				nextSong = tableBody.firstChild;
				prevSong = row.previousElementSibling;
			} else {
				nextSong = row.nextElementSibling;
				prevSong = row.previousElementSibling;
			}
		}
	}

	function setRepeat(){
		if (repeatSong){
			currentAudio.loop = true;
		} else {
			currentAudio.loop = false;
		}
	}

	function setScrollLength(){
		var input = document.getElementById('range2');
		var max = input.max;
		var min = input.min; 
		var range = max - min; 
		var w = parseInt(input.clientWidth, 10);
		var t = ~~(w * (parseInt(input.value, 10) - min) / range);
		document.getElementById("preBar").style.width = t + "px";
	}


/*-------SEARCH FOR MUSIC-------*/

	function musicSearch(value){
	    $("#resultBox").show();

		var songz = document.getElementById("songsList").children;

		for (var x = 0; x < songz.length; x++){
			var songName = songz[x].dataset.songName;
			var albumName = songz[x].dataset.albumName;

			var includesName = songName.toLowerCase().includes(value.toLowerCase());
			var includesAlbum = albumName.toLowerCase().includes(value.toLowerCase());

			if (includesName || includesAlbum){
				console.log(songz[x]);
			}
		}
	}





