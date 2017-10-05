
// Major variables / data structures

// This was helpful in determining why my clicks were firing multiple times
// https://stackoverflow.com/questions/22180953/why-is-jquery-click-event-firing-multiple-times
 
//This would just be a list of the song objects from each album; 
var fullListOfSongs = [];

var path; 
var currentSong = document.getElementById("currentSong");
var currentAudio = document.getElementById("currentAudio");
var songSelected = false; 
var shuffleSongs = false; 
var nextSong, prevSong, playingSong; 
var paused;

$(document).ready(function(){
	var loc = location.host;
	if (loc.includes("dancinglion") || loc.includes("localhost")){
		path = "/projects/sugarhead/";
	} else {
		path = "/";
	}
	var shuffleButton = document.getElementById("shuffleButton");
	shuffleButton.addEventListener("click", function(){
		this.blur();
		if (this.innerHTML == "OFF"){
			this.innerHTML = "ON";
			this.style.color = "white";
			this.style.backgroundColor = "limegreen";
			shuffleSongs = true; 
		} else{
			this.innerHTML = "OFF";
			this.style.color = "gray";
			this.style.backgroundColor = "initial";
			shuffleSongs = false; 
		}
		if (playingSong){
			setNextAndPrevSongs(playingSong);
		}
	});
	// $("#shuffleButton").click(function(){
	// 	alert("clicked");
	// 	if ($(this).innerHTML == "OFF"){
	// 		$(this).text("ON");
	// 		$(this).css("color", "white");
	// 		$(this).css("background-color", "green");
	// 	} else{
	// 		$(this).text("OFF");
	// 		$(this).css("color", "gray");
	// 		$(this).css("background-color", "initial");
	// 	}
	// });

	getAlbumsJSON();
	musicControls();




});

function getAlbumsJSON(){
	$.get(path+"Scripts/js/albums.json")
		.done(function(resp){
			// var payload = JSON.parse(resp);
			// $("#results").text(resp);
			for (var y =0; y < resp.length * resp.length; y++){
				for (var x =0; x < resp.length; x++){
				// $("#results").append("<p>" + resp[x].albumName + "</p>");
				// buildAudio(resp[x]);
					buildList(resp[x]);
				}
			}
		});
}

function buildList(payload){
	for (var q = 0; q < payload.songs.length; q++){
		var row = document.createElement("tr");
		var td1 = document.createElement("td");
		td1.appendChild(document.createTextNode(payload.songs[q].songName.substring(3)));
		var td2 = document.createElement("td");
		td2.appendChild(document.createTextNode( convertToPlayTime(payload.songs[q].songLength)));
		// console.log("Minutes " + Math.floor(payload.songs[q].songLength / 60 ));
		// console.log(":" + payload.songs[q].songLength % 60 );
		var td3 = document.createElement("td");
		td3.appendChild(document.createTextNode(payload.albumName));
		var td4 = document.createElement("td");
		td4.appendChild(document.createTextNode(payload.yearReleased));
		row.appendChild(td1);
		row.appendChild(td2);
		row.appendChild(td3);
		row.appendChild(td4);
		row.setAttribute("data-song", "/projects/sugarhead/music/"+payload.albumName+"/"+payload.songs[q].songName);
		row.setAttribute("data-song-name", payload.songs[q].songName);
		row.setAttribute("data-album-name", payload.albumName);
		row.setAttribute("class", "clickSong");
		row.style.cursor = "pointer";

		fullListOfSongs.push(row);
		$("#songsList").append(row);
	}
	musicControls();
}

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

// function clickSong(){
// 	$(".clickSong").dblclick(function(){
// 		$("#songRes").empty();
// 		$("#songName").empty().text($(this).attr("data-song-name").substring(3));	
// 		$("#albumName").empty().text($(this).attr("data-album-name"));	
// 		// console.log($(this).attr("data-song-name"));
// 		// $("#albumName").empty().text("iMusic");	

// 		var songName = $(this).attr("data-song-name");
// 		var albumName = $(this).attr("data-album-name");
// 		var src = path + "music/" + albumName + "/" + songName;
// 		// var src = $(this).attr("data-song");
// 		var newAudio = document.createElement("audio");
// 		newAudio.setAttribute("src", src);
// 		newAudio.setAttribute("controls", "controls");
// 		newAudio.setAttribute("autoplay", true);
// 		document.getElementById("songRes").appendChild(newAudio);

// 		$("#playButton").hide();
// 		$("#pauseButton").show();
// 		musicControls(newAudio);
// 	});
// }
function clickSong(){
	
}

// function playSong(albumName, songName){
// 	$("#songName").empty().text(songName.substring(3));	
// 	$("#albumName").empty().text(albumName);
// 	var src = path + "music/" + albumName + "/" + songName;
// 	currentSong.src = src;
// 	currentAudio.load();
// 	songSelected = true; 
// 	$("#playButton").hide();
// 	$("#pauseButton").show();
// }

function playSong(row){
	var songName = row.dataset.songName;
	var albumName = row.dataset.albumName;
	$("#songName").empty().text(songName.substring(3));	
	$("#albumName").empty().text(albumName);
	var src = path + "music/" + albumName + "/" + songName;
	currentSong.src = src;
	currentAudio.load();

	currentAudio.onloadeddata = function(){
		// console.log(currentAudio.duration);
		var duration = convertToPlayTime(currentAudio.duration);
		$("#durationTime").text(duration);
		var currentTime = convertToPlayTime(currentAudio.currentTime);
		$("#currentTime").text(currentTime);
		setInterval(function(){
			if(!currentAudio.paused){
				var currentTime = convertToPlayTime(currentAudio.currentTime);
				$("#currentTime").text(currentTime);
			}
			calculatePercentage(currentAudio.currentTime, currentAudio.duration);
		}, 1100);

	}
	currentAudio.addEventListener("ended", function(){
		paused = true;
		playSong(nextSong);
	});

	

	// currentAudio.addEventListener("playing", function(){
	// 	console.log("Playing....");
	// 	// }
			
	// });
	// alert(currentAudio.duration);
	

	songSelected = true; 
	$("#playButton").hide();
	$("#pauseButton").show();
	highlightCurrentSong(row);
}

function calculatePercentage(current, duration){
	console.log(Math.round(current/duration * 100));
	var perc = current/duration * 100;

	$("#songScroll").css("width", perc+"%");
}


function pauseSong(){

}

function highlightCurrentSong(row, scroll){
	$(".selectedRow").each(function(){
		$(this).removeClass("selectedRow");
	});
	row.classList.add("selectedRow");
	playingSong = row; 
	// row.scrollIntoView();
	setNextAndPrevSongs(row);
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

function musicControls(){
	$("*").unbind("click");
	$(".clickSong").dblclick(function(){
		var songName = $(this).attr("data-song-name");
		var albumName = $(this).attr("data-album-name");
		// playSong(albumName, songName);
		playSong($(this)[0]);
		// highlightCurrentSong($(this)[0]);

	});

	$("#playButton").click(function(){
		if (!songSelected){
			var randomSong = fullListOfSongs[Math.floor(Math.random()*fullListOfSongs.length)];
			// playSong(randomSong.dataset.albumName, randomSong.dataset.songName);
			playSong(randomSong);
			// highlightCurrentSong(randomSong);
		} else{
			currentAudio.play();
			$("#playButton").hide();
			$("#pauseButton").show();
		}		
	});

	$("#pauseButton").click(function(){
		currentAudio.pause();
		$("#playButton").show();
		$("#pauseButton").hide();
	});

	$("#nextSongButton").click(function(){
		if (nextSong){
			playSong(nextSong);
		}
	});
	$("#prevSongButton").click(function(){
		if (prevSong){
			playSong(prevSong);
		}
	});
}

// function buildAudio(payload){
// 	$("#results").append("<h3>" + payload.albumName + "</h3>");

// 	for (var y = 0; y < payload.songs.length; y++){
// 		$("#results").append("<span>" + payload.songs[y].songName+"</span>");
// 		var newAudio = document.createElement("audio");
// 		newAudio.setAttribute("src", "/projects/sugarhead/music/"+payload.albumName+"/"+payload.songs[y].songName);
// 		newAudio.setAttribute("controls", "controls");
// 		document.getElementById("results").appendChild(newAudio);
// 		$("#results").append("<br>");
// 	}	
// }