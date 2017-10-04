
// Major variables / data structures
 
 //This would just be a list of the song objects from each album; 
	var fullListOfSongs = [];

/* 
	NEEDS:
		1. A controller for the current song. In order to play the next song. Consider both in order as well as shuffle. 
			* Essentially, eac song would require a value of 'next' song. 
		2. The table view of songs. It should be the same for the most part between the 2 views.
			* Album view (maybe just remove the album column)
			* list view ... show a column for the album
		3. 
	
*/

$(document).ready(function(){
	getAlbumsJSON();
});

function getAlbumsJSON(){
	$.get("/projects/sugarhead/Scripts/js/albums.json")
		.done(function(resp){
			// var payload = JSON.parse(resp);
			// $("#results").text(resp);
			for (var y =0; y < resp.length; y++){
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

		$("#songsList").append(row);

		// var song = document.createElement("p");
		// song.appendChild(document.createTextNode(payload.songs[q].songName.substring(3)));
		// song.setAttribute("data-song", "/projects/sugarhead/music/"+payload.albumName+"/"+payload.songs[q].songName);
		// song.setAttribute("class", "clickSong");
		// song.style.cursor = "pointer";
		// $("#results").append(song);
	}
	clickSong();
	// for (var you = 0; you < 1000; you++){
	// 	$("#results").append("<p>Test</p>");

	// }
}

function convertToPlayTime(value){
	var min, secs, playTime; 
	min = Math.floor(value / 60);
	secs = value % 60; 
	playTime = min + ":" + secs;
	return playTime;

}

function clickSong(){
	$(".clickSong").dblclick(function(){
		$("#songRes").empty();
		$("#songName").empty().text($(this).attr("data-song-name").substring(3));	
		$("#albumName").empty().text($(this).attr("data-album-name"));	
		// console.log($(this).attr("data-song-name"));
		// $("#albumName").empty().text("iMusic");	
		var src = $(this).attr("data-song");
		var newAudio = document.createElement("audio");
		newAudio.setAttribute("src", src);
		newAudio.setAttribute("controls", "controls");
		newAudio.setAttribute("autoplay", true);
		document.getElementById("songRes").appendChild(newAudio);

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