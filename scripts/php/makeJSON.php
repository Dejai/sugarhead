<!DOCTYPE html>
<html>
<head>
	<title>Making JSON Object</title>
	<script type="text/javascript">
		var songsArray = [
			<?php
				$songsArray = array();
				$dir = "../../music";
				$files = scandir($dir, 1);
				for ($x = 0; $x < count($files); $x++){
					$albumName = $files[$x];
					if (strpos($albumName, ".") === false){
						$albumFolder = "../../music/". $files[$x];
						$songs = scandir($albumFolder);
						foreach ($songs as $mp){
							if (strpos($mp, ".") > 0){
								$info = "\"". $mp."~".$files[$x] ."\"";
								array_push($songsArray, $info);
							}
						}
					}
				}
				echo implode(",", $songsArray);
			?>
		];
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
		var songsJSON = [];

		document.addEventListener("DOMContentLoaded", createObjects, true);

		function createObjects(){
			document.getElementById("songTotal").innerHTML = songsArray.length;
			document.getElementById("currentProcess").innerHTML = "Creating Objects ... ";

			var x = 0;
			var songLoop = setInterval(function(){
				if (x < songsArray.length){
				// if (x < 220){
					var split = songsArray[x].split("~");
					var obj = {}; 
					obj["trackName"] = split[0];
					obj["songName"] = split[0].substring(2).replace(/.mp3/g, '').replace(/.m4a/g, '').trim();
					obj["songLength"] = 0;
					obj["songOrder"] = split[0].substring(0,3).trim();
					obj["songAlbum"] = split[1];
					obj["songReleaseYear"] = albumsObj[split[1]];
					obj["highlighted"] = false;
					// getDuration(obj);
					songsJSON.push(obj);
					document.getElementById("currentCount").innerHTML = x+1;
					x++;
				} else {
					clearInterval(songLoop);
					getDuration();
				}
			}, 20);

		}

		function getDuration() {
			document.getElementById("currentProcess").innerHTML = "Getting Song Lengths ...";

			var audio = document.getElementById("currentAudio");
			var audioSource = document.getElementById("currentSong");

			var x = 0;
			var getDurationLoop = setInterval(function (){
				if (x < songsJSON.length){
					document.getElementById("currentCount").innerHTML = x+1;
					var sourceURL = "/sugarhead/music/" + songsJSON[x].songAlbum + "/" + songsJSON[x].trackName; 
					sourceURL = cleanUpURI(sourceURL);
					audioSource.src = sourceURL;
					audio.load();
					audio.onloadeddata = function(){
						songsJSON[x].songLength = Math.round(audio.duration);
						x++;
					}
				} else {
					clearInterval(getDurationLoop);
					document.getElementById("resultsObj").innerHTML = JSON.stringify(songsJSON);
					writeObject();
				}
			}, 500);

		}

		function cleanUpURI(uri){
			var clean = decodeURIComponent(uri);
			clean = clean.replace(/&amp;/g, '&');
			return clean;
		}

		function writeObject(){
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "writeJSON.php", true);
		  	xhttp.setRequestHeader("Content-type", "application/json");
		  	var data = JSON.stringify(songsJSON);
		  	xhttp.onreadystatechange = function() {
		        if (this.readyState == 4 && this.status == 200 && !this.responseText.includes("ERROR!")) {
		        	alert("I'm officially done! Content written to file!");
		       } else if ( this.readyState == 4 && this.status == 200 && this.responseText.includes("ERROR!")) {
		       		alert("ERROR!\nSorry, something went wrong!\n" + this.responseText);
		       }
		    };
			xhttp.send(data);
		}
	</script>
</head>
<body>
<div>
	<h1>Processing Songs</h1>
	<br/>
	<h3 id="currentProcess" style="display:inline-block; width:200px;"></h3>
	<h3 style="display:inline-block;"><span id="currentCount">0</span> of <span id="songTotal"></span></h3>
</div>
<div id="resultsObj">
	<img src="https://media1.giphy.com/media/rEgkXRBD7RoB2/giphy.gif" style="height:300px; width:300px;">
</div>
<audio id="currentAudio" style="width:100px; height:100px;">
	<source id="currentSong" type="audio/mpeg" >
</audio>
</body>
</html>