<!DOCTYPE html>
<html>
<head>
	<title>Make JSON</title>
	<script type="text/javascript">
		var albumsObj = {
						"Band A Lion" : "2007-08", 
						"Blood Sweat & Tears" : "2010-11", 
						"Breaking Out" : "2008-09", 
						"De Extra Mile" : "2000-01", 
						"De Real Ting" : "1995-96", 
						"Everything Is Everything" : "2011-12", 
						"For The People" : "2006-07", 
						"Higher Ground" : "1998-99", 
						"iMusic" : "2016-17", 
						"It's All Good" : "1996-97", 
						"Kross Roads" : "2009-10", 
						"Main Event" : "2015-16", 
						"Moving On" : "1997-98", 
						"No Loose Ends" : "1999-00",
						"On Dah Rock" : "2004-05",
						"One Order" : "2012-13",
						"Pour It On" : "2004-05",
						"Reloaded" : "2003-04",
						"Rolling Deep" : "2005-06",
						"Stage Pass" : "2013-14",
						"Step Up" : "2002-03",
						"Sugar" : "2001-02 ",
						"The Formula" : "2015-16"
					};
		var getLengthLater = [];
		var audio, audioSource;

		document.addEventListener("DOMContentLoaded", init, true);

		function init(){
			audio = document.getElementById("currentAudio");
			audioSource = document.getElementById("currentSong");
			var lists = document.getElementById("albumList").querySelectorAll("ul");

			var x = 0;
			for (var x = 0; x < lists.length; x++){
				var album = lists[x].querySelectorAll("span")[0].innerHTML;
				var songs = lists[x].querySelectorAll("li");
				var releaseYear = albumsObj[cleanUpURI(album)] ? albumsObj[cleanUpURI(album)] : "Unknown";
				albumsObj[album] = { "releaseYear" : releaseYear, "albumCover" : "/sugarhead/music/"+ album + "/albumCover.png", "songs" : [] };
				// console.log(album);
				for (var y = 0; y < songs.length; y++){

					var songName = songs[y].innerHTML;
					songName = songName.replace(/.mp3/g, '').replace(/.m4a/g, '').trim();

					var src = "/sugarhead/music/" + album + "/" + songs[y].innerHTML;
					src = cleanUpURI(src);

					var songObj = {};
					var songOrder = calculateSongOrder(songs[y].innerHTML);
					var duration = calculateDuration(src);
					songObj["songName"] = songName;
					songObj["songLength"] = 0;
					songObj["order"] = songOrder;
					albumsObj[album].songs.push(songObj);
					getLengthLater.push( album + "=" + songOrder + "=" + src);
				}
			}
			// jSON += "]";
			
			// document.getElementById("results").innerHTML = JSON.stringify(albumsObj);
			// document.getElementById("results").innerHTML = JSON.stringify(getLengthLater).split(",").join("<br/>");
			// console.log(getLengthLater.length);
			// document.getElementById("results").innerHTML = JSON.stringify(albumsObj).split("},").join("<br/>");

			calculateDuration2();

			// calculateDuration("/sugarhead/music/Band A Lion/01 Strike Up De Band.mp3");
		}




		function calculateSongOrder(song){
			var stringNum = song.substring(0,2);
			return Number(stringNum);
		}

		function calculateDuration(url){
			var time;
			audioSource.src = url;
			audio.load();
			audio.onloadeddata = function(){
				// alert(Math.round(audio.duration));
				time = Math.round(audio.duration);
			}
			return time;

		}
		function calculateDuration2(){
			var x = 0;

			var calc = setInterval(function(){
				if (x <= getLengthLater.length-1){
				// if (x <= 3){
					// console.log(getLengthLater[x]);
					var splitz = getLengthLater[x].split("=");
					var alb = splitz[0];
					var ind = Number(splitz[1])-1;
					var src = splitz[2];

					audioSource.src = src;
					audio.load();
					audio.onloadeddata = function(){
						albumsObj[alb].songs[ind]["songLength"] = Math.round(audio.duration);
						// console.log(albumsObj[alb].songs[ind]["length"]);
					}
					// document.getElementById("results").innerHTML = "Processing ..." + x + " of " + getLengthLater.length;
					// console.log("Processing ..." + x + " of " + getLengthLater.length);
					x++;
					// document.getElementById("results").innerHTML = JSON.stringify(albumsObj[alb].songs[ind-1]);
					// document.getElementById("results").innerHTML = JSON.stringify(albumsObj);
					document.getElementById("results").innerHTML = "Processing ... " + x + " of " + getLengthLater.length;
				// } else {
					// document.getElementById("results").innerHTML = JSON.stringify(albumsObj);
				} else {
					document.getElementById("results").innerHTML = "<h1>Done</h1>" + JSON.stringify(albumsObj);
					
					clearInterval(calc);
					// console.log('Done');

					// document.getElementById("results").innerHTML = "Complete!" + x + " of " + getLengthLater.length;
					// document.getElementById("results").innerHTML = JSON.stringify(albumsObj);

				}
			}, 500);
			
		}







		// var jSON = "[";

		// function init(){
		// 	var lists = document.getElementById("albumList").querySelectorAll("ul");
		// 	var x = 0;
		// 	for (var x = 0; x < lists.length; x++){
		// 		createAudio(lists[x]);
		// 	}
		// 	jSON += "]";
		// 	document.getElementById("results").innerHTML = jSON;
		// }

		// function createAudio(albumList){
		// 	// console.log(albumList);

		// 	try{
		// 		var album = albumList.querySelectorAll("span")[0];
		// 		var songs = albumList.querySelectorAll("li");
		// 		console.log(album);
		// 		for (var x = 0; x < songs.length; x++){
		// 			var audio = document.createElement("audio");
		// 			audio.setAttribute("controls", "true");
		// 			var source = document.createElement("source");
		// 			source.setAttribute("type", "audio/mpeg");
		// 			var src = "/sugarhead/music/" + album.innerHTML + "/" + songs[x].innerHTML;
		// 			// src = encodeURIComponent(src);
		// 			src = cleanUpURI(src);
		// 			console.log(cleanUpURI(src));
		// 			// try {
		// 				// source.src = src;
		// 				// audio.appendChild(source);
		// 				// document.getElementById("resAudios").appendChild(audio);
		// 			// }
		// 			// if (src){
		// 			// 	source.src = src;
		// 			// // }
		// 			// audio.appendChild(source);
		// 		}
		// 	} catch (err){
		// 		alert(err);
		// 	}
		// }

		function cleanUpURI(uri){
			var clean = decodeURIComponent(uri);
			clean = clean.replace(/&amp;/g, '&');
			return clean;

		}


		// function buildJSON(list, upSep){
		// 	var name = list.querySelectorAll("span");
		// 	var songs = list.querySelectorAll("li");
		// 	jSON += "<br/>{<br/>\"albumName\" : \" " + name[0].innerHTML + "\",";
		// 	jSON += "<br/>\"songs\" : [";
		// 	for (var x = 0; x < songs.length; x++){
		// 		// setTimeout(function(x){
		// 			getLength(name[0].innerHTML, songs[x].innerHTML);
		// 			// var sep = x < songs.length-1 ? "," : " "; 
		// 			// jSON += "<br/>&nbsp; {\"songName\" : \"" + songs[x].innerHTML + "\"}" + sep; 
		// 			// console.log(name[0].innerHTML);
		// 			// console.log(songs[x].innerHTMl);
		// 		// }, 2000);
				  
		// 	}
		// 	jSON += "<br/>]<br/>}" + upSep;
		// 	// console.log(name[0].innerHTML);
		// }

		// function getLength(album, song){
		// 	var sorc = document.getElementById("currentSong");
		// 	var audio = document.getElementById("currentAudio");
		// 	try {
		// 		var src = "/sugarhead/music/" + album + "/" + song;
		// 		sorc.src = decodeURIComponent(src);
		// 		var duration = 0;
		// 		setTimeout(function(){
		// 			console.log(decodeURIComponent(src));
		// 			audio.onloadeddata = function(){
		// 				duration = convertToPlayTime(audio.duration);
		// 			}
		// 			console.log(duration);
		// 		}, 2000);

				

		// 	} catch (err){
		// 		// alert(err);
		// 		console.log(err + "\n" + sorc);
		// 	}
			
		// }

		// function convertToPlayTime(value){
		// 	var min, secs, playTime; 
		// 	min = Math.floor(value / 60);
		// 	secs = Math.round(value % 60);
		// 	if (secs < 10){
		// 		secs = "0" + secs;
		// 	}
		// 	playTime = min + ":" + secs;
		// 	return playTime;
		// }

	</script>
</head>
<body>
<div style="border:1px solid black;">
	<h3>Folders & Songs</h3>
	<div id = "albumList" style="float:left; width:30%;">
		<?php
				$home = "../../";
				$dir = "../../music";
				$files = scandir($dir, 1);
				for ($x = 0; $x < count($files); $x++){
					$albumName = $files[$x];
					if (strpos($albumName, ".") === false){
						echo "<ul>" . "<span>" . $files[$x] . "</span>";
						$album = $home . 'music/'. $files[$x];
						$songs = scandir($album);
						foreach ($songs as $mp){
							if (strpos($mp, ".") > 0){
							// echo strpos($mp, ".");
								echo "<li>" . $mp . "</li>";
							}
						}
						echo "</ul>";
					}
					
				}
			?>
	</div>
	<div id="results" style="float:left;width:50%;"></div>
	<br style="clear:both;"/>
	<div id="resAudios"></div>
</div>

<audio id="currentAudio" style="width:100px; height:100px;" controls>
	<source id="currentSong" type="audio/mpeg" >
</audio>
</body>
</html>