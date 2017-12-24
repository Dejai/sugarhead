
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

/* The App + Controller */
	var app = angular.module("sugarApp", []);

	app.controller("sugarCtrl", function($scope, $http, musicPlayer, modalContent, listeners){


		var newHeight = window.innerWidth < 500 ? window.innerHeight / 2 : window.innerHeight - 180;
		// var newHeight = window.innerHeight - 180;
		$scope.dynamicHeight = newHeight+"px";

		modalContent.checkLocalStorage();
		listeners.startListening();
		var d = new Date();
		$scope.currentYear = d.getFullYear()-1+"-"+(d.getFullYear() - 2000);

		// This is just a simple way to call the close modal function from the modalContent service via the close button
		$scope.closeModal = function(){	modalContent.hideModal(); }	


		$scope.playLeftOffSong = function(){
			try{
				var directSongRow = document.getElementById("songsList").querySelectorAll(" [data-track-name=\""+localStorage.lastTrack+"\"]");
				if (directSongRow.length > 0){
					modalContent.hideModal();
					musicPlayer.loadAndPlaySong(directSongRow[0]);
					currentAudio.currentTime = localStorage.lastTime;
				} else {
					alert("Song could not be found");
				}
			} catch (err){
				alert("Sorry! I couldn't play your song for some reason.");
				console.log(err);
			} finally {
				modalContent.hideModal();
			}	
		}

		$scope.defineSugarHead = function(){
			try{
				$scope.filterBy = ""; 
				var directSongRow = document.getElementById("songsList").querySelectorAll(" [data-track-name='07 Sugar Head.mp3']");
				if (directSongRow.length > 0){
					modalContent.hideModal();
					musicPlayer.loadAndPlaySong(directSongRow[0]);
				} else {
					alert("Song could not be found");
				}
			} catch (err){
				alert("Sorry! I couldn't play the song for some reason.");
				console.log(err);
			}
		}

		$scope.showHelp = function(){
			modalContent.showHelpContent(0,0);
		}

		$scope.theSongs = [];

		$http.get("/sugarhead/scripts/js/data/songsJSON.json")
				.then(function(response){
					$scope.theSongs = response.data;
					
				});


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
			var row;
			var elem = event.srcElement;
			if (elem.tagName == "TR"){
				row = elem;
			} else if (elem.tagName == "TD"){
				row = elem.parentNode;
			}
			if (row){
				musicPlayer.loadAndPlaySong(row);
			} else {
				alert("Hmm. That's weird! Couldn't load the song for some reason");
			}
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
			listeners.sendControl(event);
		}

		
		$scope.copyRightBool = false; 
		$scope.copyRightAction = "Click for more details";
		$scope.spanColor = "black";
		$scope.copyRightDetails = function(){
			if (!$scope.copyRightBool){
				$scope.showCopyRightDetails(); 			
			} else {
				$scope.hideCopyRightDetails();
			}
		}

		$scope.hideCopyRightDetails = function(){
			document.getElementById("moreCopyRightDetails").style.display = "none";
			$scope.copyRightBool = false; 
			$scope.copyRightAction = "Click for more details.";
			$scope.spanColor = "black";

		}

		$scope.showCopyRightDetails = function(){
			document.getElementById("moreCopyRightDetails").style.display = "block";
			$scope.copyRightBool = true; 
			$scope.copyRightAction = "Hide details.";
			$scope.spanColor = "red";
		}
		
	});




/* DIRECTIVES */
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

	app.directive("copyright", function(){
		return {
			restrict: "A", 
			templateUrl: "/sugarhead/views/copyright.html"
		};
	});

	app.directive("modal", function(){
		return { 
			restrict: "AE", 
			templateUrl: "/sugarhead/views/modal.html"
		};
	});


/* FILTER */
	app.filter("songTime", function(){
		return function(value){
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
	});
