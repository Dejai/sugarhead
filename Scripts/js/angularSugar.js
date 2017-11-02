
var path = "/sugarhead/";
var currentSong_mp3 = document.getElementById("currentSong_mp3");
var currentSong_mp4 = document.getElementById("currentSong_mp4");
var currentAudio = document.getElementById("currentAudio");
var songSelected = false;
var psuedoPaused = false;
var shuffleSongs = false; 
var repeatSong = false;
var highlightSong = '';


/* AngularJS App & Controller */

var app = angular.module("sugarApp", ["ngAnimate"]);

app.controller("sugarCtrl", function($scope, $http, $interval, musicPlayer){
	// $http.get("/sugarhead/Scripts/js/newAlbums.json")

	$scope.theSongs = [];

	// $http.get("/sugarhead/scripts/js/newestAlbum.json")
	$http.get("/sugarhead/scripts/js/songsJSON.json")
			.then(function(response){
				// $scope.albums = response.data;
				// $scope.getTheSongs();
				$scope.theSongs = response.data;
			});

	// This function converts the object of albums into individual objects for each song
	// Ideally, the data would come packaged this way --- I'll consider working on that. 
	// $scope.getTheSongs = function(){
	// 	var obj = {};
	// 	for (var album in $scope.albums){
	// 		for (var y in $scope.albums[album].songs){
	// 			var obj = {};
	// 			obj["trackName"] = $scope.albums[album].songs[y].songName;
	// 			obj["songName"] = $scope.albums[album].songs[y].songName.substring(2);
	// 			obj["songLength"] = $scope.albums[album].songs[y].songLength;
	// 			obj["songOrder"] = $scope.albums[album].songs[y].order;
	// 			obj["songAlbum"] = album;
	// 			obj["songReleaseYear"] = $scope.albums[album].releaseYear;
	// 			obj["highlighted"] = false;
	// 			$scope.theSongs.push(obj);
	// 		}
	// 	}
	// }

	$scope.initialLimit = 100;
	$scope.filterBy = '';
	// A custom filter that determines whether a row matches the given search values
	// Compares the song name as well as the song album and determins what to show
	$scope.filterFunc = function(song){
		var highlite = song.songAlbum+"-"+song.trackName;
		if (highlite == highlightSong){
			song.highlighted = true;
			// musicPlayer.viewSelected();
		} else {
			song.highlighted = false;
		}

		if (!$scope.filterBy){ 
			$scope.checkAlbums();
			return true;
		} else if (	song.songName.toLowerCase().includes($scope.filterBy.toLowerCase()) 
					|| 	song.songAlbum.toLowerCase().includes($scope.filterBy.toLowerCase())
					|| song.songReleaseYear.toLowerCase().includes($scope.filterBy.toLowerCase()))
		{	
			$scope.checkAlbums();
			return true;
		} else {
			$scope.checkAlbums();
			return false;
		}
	}

	$scope.sortValue = 'songAlbum';	$scope.sortReverse = false;
	// This function determines which column to sort the data by. 
	// It also takes into consideration whether or not to sort it in reverse
	$scope.setSort = function(x){
		$scope.sortReverse = ($scope.sortValue == x && !$scope.sortReverse) ? true : false;
		$scope.sortValue = x;
	}

	$scope.rowClick = function(event){
		// console.log(event.srcElement.parentNode.dataset.albumName + " - " + event.srcElement.parentNode.dataset.trackName);
		var row = event.srcElement.parentNode;
		var albumName = event.srcElement.parentNode.dataset.albumName;
		var trackName = event.srcElement.parentNode.dataset.trackName;
		musicPlayer.loadAndPlaySong(row);
	}

	$scope.allOneAlbum = false;
	// This function is a supplementary checking function to the filter;
	// It confirms whether or not the current list of songs are all from one album
	// And if they are , then set the boolean for this case to true; This controls the visibility of the column of album orders
	$scope.checkAlbums = function(){
		var children = document.getElementById("songsList").children
		// var children2 = document.getElementsByClassName("aSong")
		$scope.results = children.length;

		if (children.length > 0){
			var firstAlbum = children[0].dataset.albumName;
			var count = 0;
			for (var x = 0; x < children.length; x++){
				if (children[x].dataset.albumName != firstAlbum){
					$scope.allOneAlbum = false;
					break;
				} else {
					count++;
				}
			}
			if (count >= children.length-1){
				$scope.allOneAlbum = true;
			}
		} else {
			$scope.allOneAlbum = false;
		}
	}

	$scope.findCurrentSong = function(){
		musicPlayer.findCurrentSong();
	}


	$scope.audioControl = function(event){
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
				$scope.currentTime = document.getElementById("range2").value;
				var valu = parseInt((document.getElementById("range2").value), 10);
				musicPlayer.setScrollLength(valu);
				break;
			case "postScroll":
				currentAudio.currentTime = document.getElementById("range2").value;
				psuedoPaused = false;
				break;
			default:
				musicPlayer.pauseSong();
		}
	}

	$scope.setDuration = function(){
		$scope.duration = currentAudio.duration;
		// Just after setting the duration, I hadd a listener for when the song ends, so it knows to change to the next song.
		currentAudio.addEventListener("ended", function(){
			musicPlayer.changeSong("next");
		});
	}
	$scope.setCurrentTime = function(){
		$scope.currentTime = 0;
		musicPlayer.setScrollLength(0);
		$interval(function(){
			// I added a pseudoPaused variable here that stops this loop from adjusting the scroll bar if a user is currently changing it
			// This allows a user to smoothly scroll that bar without hindering the song, or without being annoyed by the fact that the scroll would re-adjust itself
			if(!currentAudio.paused && !psuedoPaused){
				$scope.currentTime = currentAudio.currentTime;
				var valu = parseInt((currentAudio.currentTime+1), 10);
				musicPlayer.setScrollLength(valu);
			}
		}, 1000);
	}

} );


app.directive("songRow", function(){
	return {
		restrict: "EAC",
		link : function(scope, element, attr){
			if(scope.$last){
				document.getElementById("ngApp").style.visibility = "visible";
				document.getElementById("ngApp").style.opacity =  1;
			}
		},
		templateUrl: "/sugarhead/views/songsListing.html"
	};
});



app.service("musicPlayer", function(){
	// This is the KEY function that determines what song to load (which has an autoplay associated with it)
	// It accounts for the two major file types & once loaded, runs the static functions related to the playing of a song
	this.loadAndPlaySong = function(row){
		var albumName = row.dataset.albumName;
		var trackName = row.dataset.trackName;
		highlightSong = albumName+"-"+trackName;
		var src = path + "music/" + albumName + "/" + trackName;
		// var src2 = path + "music/" + albumName + "/" + trackName;
		src = decodeURIComponent(src);
		// src2 = decodeURIComponent(src2);
		currentSong_mp3.src = src;
		currentSong_mp4.src = src;
		currentAudio.load();
		currentAudio.onloadeddata = function(){
			playVsPause("play");
			songSelected = true;
			setTimes();
			showSongAndScroll(trackName.substring(2).replace(/.mp3/g, '').replace(/.m4a/g, '').trim());	
			viewSelected();	
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
		
		if (highlighted.length == 1 && currentListedSongs.length == 1){
			this.restartSong();
		} else if (currentListedSongs.length == 1){  // Then check if there is only one song to view anyway
			this.loadAndPlaySong(currentListedSongs[0]);
		} else if (highlighted.length > 0 ) {
			if (repeatSong){
				this.restartSong();
			} else if (shuffleSongs) {  
				var randNum = Math.floor(Math.random()*currentListedSongs.length)
				this.loadAndPlaySong(currentListedSongs[randNum]);
			} else {
				var x = 0;
				while ( !(currentListedSongs[x] === highlighted[0])  ){
					x++;
					if (x > 1000){
						break;
						console.log(" \"Manual break\" ");
					}
				}
				if (direction == "next"){
					var index = (x+1 >= currentListedSongs.length) ? 0 : x+1;
				} else{
					var index = (x-1 < 0) ? currentListedSongs.length-1 : x-1;
				}
				this.loadAndPlaySong(currentListedSongs[index]);
			}
		} else {
			if (repeatSong){
				this.restartSong();
			} else if (shuffleSongs) {  
				var randNum = Math.floor(Math.random()*currentListedSongs.length)
				this.loadAndPlaySong(currentListedSongs[randNum]);
			} else {
				var ind = (direction == "next") ? 0 : currentListedSongs.length-1;
				this.loadAndPlaySong(currentListedSongs[ind]);
			}
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
	this.setScrollLength = function(value){
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


	/*STATIC METHODS */

	// This controls the scrolling of the song into view if it is not
	var viewSelected = function(){
		if (document.querySelectorAll("[data-song-selected='true']").length > 0 ){
			document.querySelectorAll("[data-song-selected='true']")[0].scrollIntoView({behavior:"smooth"});
		}
	}
	
	// This triggers the $scope based functions to set the song duration and the start the song interval call
	var setTimes = function(){
		document.getElementById("durationTime").click();
		document.getElementById("currentTime").click();
	}
	// This initializes the values for the range input that will correlate with the length of the song
	var showSongAndScroll = function(song){
		document.getElementById("songName").innerHTML = song;
		document.getElementById('songScrollContainer').style.display = "block";
		document.getElementById('range2').style.display = "inline-block";
		document.getElementById('range2').value = 0;
		document.getElementById('range2').max = parseInt(currentAudio.duration, 10);
	}
	// This determines which icon to display based on the current playing state of the audio (play vs. pause :) )
	var playVsPause = function(status){
		if (status == "play"){
			document.getElementById("playButton").style.display = "none";
			var pauseButton = document.getElementById("pauseButton");
			if (pauseButton.classList.contains("hidden")){
				pauseButton.classList.remove("hidden");
			}
			pauseButton.style.display = "inline";
		} else {
			document.getElementById("playButton").style.display = "inline";
			document.getElementById("pauseButton").style.display = "none";
		}
	}
	// DEPRECATED: This used to be the function responsible for highlighting the row; This has since been handled by object values and CSS
	var highlightRow = function(row){
		var removeHighlight = document.getElementsByClassName("selectedRow");

		if (removeHighlight.length > 0){
			for (var x = 0; x < removeHighlight.length; x++){
				removeHighlight[x].classList.remove("selectedRow");
			}
		}
		row.classList.add("selectedRow");
		// playingSong = row; 
		// setNextAndPrevSongs(row);
		row.scrollIntoView({behavior:"smooth"});
	}
});



app.filter("songTime", function(){
	return function(value){
		var min, secs, playTime; 
		min = Math.floor(value / 60);
		secs = Math.round(value % 60);
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
});