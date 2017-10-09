
// Major variables / data structures

// This was helpful in determining why my clicks were firing multiple times
// https://stackoverflow.com/questions/22180953/why-is-jquery-click-event-firing-multiple-times

// Could be a life saver in finding a track option for the song
//https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
//https://jsfiddle.net/fedeghe/smjje829/
 
//This would just be a list of the song objects from each album; 
var fullListOfSongs = [];

var path = "/sugarhead/"; 
var currentSong_mp3 = document.getElementById("currentSong_mp3");
var currentSong_mp4 = document.getElementById("currentSong_mp4");
var currentAudio = document.getElementById("currentAudio");
var songSelected = false; 
var shuffleSongs = false; 
var nextSong, prevSong, playingSong; 
var paused;
var currentTimeInterval, currentScrollInterval;

$(document).ready(function(){

	document.getElementById('range2').style.display = "none";

	var shuffleButton = document.getElementById("shuffleButton");
	shuffleButton.addEventListener("click", function(){
		var shuffleStatus = this.dataset.shuffleStatus;
		// alert(this.dataset.shuffleStatus);
		this.blur();
		if (shuffleStatus == "OFF"){
			// this.innerHTML = "ON";
			this.dataset.shuffleStatus = "ON";
			this.style.color = "limegreen";
			// this.style.backgroundColor = "limegreen";
			shuffleSongs = true; 
		} else{
			// this.innerHTML = "OFF";
			this.dataset.shuffleStatus = "OFF";
			this.style.color = "gray";
			this.style.backgroundColor = "initial";
			shuffleSongs = false; 
		}
		if (playingSong){
			setNextAndPrevSongs(playingSong);
		}
	});

	getAlbumsJSON();
	musicControls();


	$("div").click(function(){
		alert($(this));
	});



});

function getAlbumsJSON(){
	$.get(path+"Scripts/js/albums.json")
		.done(function(resp){
			// var payload = JSON.parse(resp);
			// $("#results").text(resp);
			// for (var y =0; y < resp.length * resp.length; y++){
				for (var x =0; x < resp.length; x++){
				// $("#results").append("<p>" + resp[x].albumName + "</p>");
				// buildAudio(resp[x]);
					buildList(resp[x]);
				}
			// }
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
		// row.setAttribute("data-song", "/projects/sugarhead/music/"+payload.albumName+"/"+payload.songs[q].songName);
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

function playSong(row){

	calculatePercentage(0, 0);

	$("#durationTime").text("");
	$("#currentTime").text("");


	var songName = row.dataset.songName;
	var albumName = row.dataset.albumName;
	$("#songName").empty().text(songName.substring(3));	
	$("#albumName").empty().text(albumName);
	var src = path + "music/" + albumName + "/" + songName + ".mp3";
	var src2 = path + "music/" + albumName + "/" + songName + ".m4a";
	src = decodeURIComponent(src);
	currentSong_mp3.src = src;
	currentSong_mp4.src = src2;
	// console.log(src);
	currentAudio.load();

	currentAudio.onloadeddata = function(){
		document.getElementById('range2').style.display = "inline-block";
		document.getElementById('range2').value = "0";
		rangeColor(document.getElementById('range2'));

		slideControls();
		// console.log(currentAudio.duration);
		var duration = convertToPlayTime(currentAudio.duration);
		$("#durationTime").text(duration);
		var currentTime = convertToPlayTime(currentAudio.currentTime);
		$("#currentTime").text(currentTime);
		// currentScrollInterval = setInterval(function(){
		// 	if(!currentAudio.paused){
		// 		calculatePercentage(currentAudio.currentTime, currentAudio.duration);
		// 	}
		// }, 0001);
		currentTimeInterval = setInterval(function(){
			if(!currentAudio.paused){
				var currentTime = convertToPlayTime(currentAudio.currentTime);
				$("#currentTime").text(currentTime);
				calculatePercentage(currentAudio.currentTime, currentAudio.duration);
			}
		}, 1100);
		
		songSelected = true;
		$("#playButton").hide();
		$("#pauseButton").show();
	}
	currentAudio.addEventListener("ended", function(){
		highlightCurrentSong(row);
		playSong(nextSong);
	});
	highlightCurrentSong(row);
}

function calculatePercentage(current, duration){
	if (current == 0 && duration == 0){
		$("#songScroll").css("width", "0%");
		// $("#range2").val(0);
	} else {
		var perc = current/duration * 100;
		$("#songScroll").css("width", perc+"%");
		// $("#range2").val(perc);
		rangeColor(document.getElementById('range2'));
	}
	$("#range2").val(parseInt(perc,10));
	rangeColor(document.getElementById('range2'));

	// console.log(document.getElementById("songScroll").offsetLeft);
	// console.log(Math.round(current/duration * 100));

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

function slideControls(){

	document.getElementById("range2").addEventListener("click", function(){
		console.log(this.value);
		var selectedTime = this.value; 
		selectedTime = (selectedTime / 100) * currentAudio.duration;
		currentAudio.currentTime = selectedTime;
		calculatePercentage(currentAudio.currentTime, currentAudio.duration);
		// calculatePercentage(selectedTime, currentAudio.duration);

	});

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
