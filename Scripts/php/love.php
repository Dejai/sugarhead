<!DOCTYPE html>
<html>
<head>
	<title>Make JSON</title>
	<script type="text/javascript">
		var albumsObj = {
						

						"De Real Ting" : "1995-96", 
						"It's All Good" : "1996-97", 
						"Moving On" : "1997-98", 
						"Higher Ground" : "1998-99", 
						"No Loose Ends" : "1999-00",
						"De Extra Mile" : "2000-01", 
						"Sugar" : "2001-02 ",
						"Step Up" : "2002-03",
						"Reloaded" : "2003-04",
						"On Dah Rock" : "2004-05",
						"Pour It On" : "2004-05",
						"Rolling Deep" : "2005-06",
						"For The People" : "2006-07", 
						"Band A Lion" : "2007-08", 
						"Breaking Out" : "2008-09", 
						"Kross Roads" : "2009-10",
						"Blood Sweat & Tears" : "2010-11",
						"Everything Is Everything" : "2011-12",
						"One Order" : "2012-13",
						"Stage Pass" : "2013-14",
						"The Formula" : "2014-15",
						"Main Event" : "2015-16", 
						"iMusic" : "2016-17"

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
			calculateDuration2();
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
					var splitz = getLengthLater[x].split("=");
					var alb = splitz[0];
					var ind = Number(splitz[1])-1;
					var src = splitz[2];

					audioSource.src = src;
					audio.load();
					audio.onloadeddata = function(){
						albumsObj[alb].songs[ind]["songLength"] = Math.round(audio.duration);
					}
					x++;
					document.getElementById("results").innerHTML = "Processing ... " + x + " of " + getLengthLater.length;
				} else {
					document.getElementById("results").innerHTML = "<h1>Done</h1>" + JSON.stringify(albumsObj);
					clearInterval(calc);
				}
			}, 500);
			
		}


		function cleanUpURI(uri){
			var clean = decodeURIComponent(uri);
			clean = clean.replace(/&amp;/g, '&');
			return clean;

		}

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