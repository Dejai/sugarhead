
<!DOCTYPE html>
<html>
<head>
	<title>SugarHead Processing</title>
</head>
<body>
	<?php 
		// require "../../music/Albums.xml";
		$myXMLData = file_get_contents("../../music/Albums.xml");
		$xml= simplexml_load_string($myXMLData) or die("Error: Cannot create XML object!");
		// print_r($xml);
	?>
	<div style="float:left; width:100%;" id="first_step">
		<div style="float:left; width:32%;">
			<h1 id="first_title">Loading Songs </h1>
			<h1 id="first_title_pt2" style="display:none;">Songs Loaded&nbsp;&nbsp;<span style="color:blue;">&rarr;</span></h1>
			<!-- <p> <span id="currentSong"><?php echo $load_count?></span> out of <span id='totalSongs'><?php echo $total_count ?></span></p> -->
		</div>
		<div style="float:left;width:32%;display:none;" id="second_step">
			<h1 id="second_title">Getting Song Lengths </h1>
			<p> <span id="currentCount">0</span> out of <span id='totalSongs'>0</span></p>
		</div>
	</div>
	<br/>
	<hr/>
	<table>
		<tr>
			<th>Album</th>
			<th>Song</th>
			<th>ID</th>
			<th>Audio</th>
			<th>Length</th>
		</tr>
		<tbody>
			<?php 
				$songCount = 0;
				for ($x = 0; $x < count($xml); $x++){
					$currentAlbum = $xml->album[$x];
					$currentTracks = $xml->album[$x]->tracks->track;
					for ($y = 0; $y < count($currentTracks); $y++){
						// print_r($currentAlbum);
						$songCount++;
						$track = $currentTracks[$y];
						echo "<tr>";
						echo "<td>" . $xml->album[$x]->albumName . "</td>";
						echo "<td>" . $track->trackName . "</td>";
						echo "<td class='songIDs'>" . $track['id'] . "</td>";
						$source = "http://docs.google.com/uc?export=open&id=" . $track['id'];
						echo "<td><audio class='audio' style=\"width:250px; height:100px;\" controls>"
							 .	"<source src=\"". $source  . "\" id=\"currentSong_mp3\" type=\"audio/mpeg\">"
							 .	"<source src=\"". $source  . "\" id=\"currentSong_mp4\" type=\"audio/mp3\">"
							 ."</audio></td>";
						echo "</tr>";
						echo "<td id='" . $track['id'] . "'></td>";

					}
				}
				echo "<p style='display:none;' id='xml_ready'>". $songCount . "</p>";
			?>
		</tbody>
	</table>
	<!-- <h1 id='script_ready'></h1> -->
 	<script type="text/javascript">
 		document.addEventListener("DOMContentLoaded", function(){
 			var xmlCount;

 			var getReadyStatus = setInterval(function (){

 				xmlCount = document.getElementById("xml_ready").innerHTML; 

				if (xmlCount !== undefined && xmlCount > 0){
					clearInterval(getReadyStatus);

					document.getElementById("first_title").style.display = "none";
					document.getElementById("first_title_pt2").style.display = "inline-block";
					// document.getElementById("first_title_pt2").innerHTML = "Songs Loaded &rrr;";
					document.getElementById("totalSongs").innerHTML = xmlCount;
					document.getElementById("second_step").style.display = "inline-block";

					checkForAudioLength(xmlCount);
	 				// document.getElementById("script_ready").innerHTML = "CARRY ME HOME TONIGHT!";
					// createAudio();
				}
			}, 500);
 		});

 		function checkForAudioLength(total){

			var listOfAudioFiles = document.querySelectorAll("audio");	

			var ignores = [];		

			var processed = 0;

 			var checkForLoadedAudio = setInterval(function (){
 				for(var y = 0; y < listOfAudioFiles.length; y++){
					if (ignores.includes(y)){
						continue;
					}

					var duration = listOfAudioFiles[y].duration;

					if (duration > 0 && duration !== NaN && typeof(duration) == "number"){
						console.log(listOfAudioFiles[y].currentSrc);
						var id = listOfAudioFiles[y].currentSrc.split("=")[1];
						console.log(id);
						// document.getElementById(id).innerHTML = Math.round(duration);
						ignores.push(y);
						processed++;
						document.getElementById("currentCount").innerHTML = processed;
						// console.log(processed);
						// console.log((processed == total));
					}
				}
				if (processed == total){
					console.log("WE ARE THE CHAMPIONS");
					clearInterval(checkForLoadedAudio);
				}
			}, 5000);
 		}

 		function createAudio(){
 		// 	var audio = document.getElementById("currentAudio");
			// var audioSource = document.getElementById("currentSong");

			// var listOfSongIDs = document.querySelectorAll(".songIDs");
			// console.log(listOfSongIDs);
			// var x = 0;
			// var getDurationLoop = setInterval(function (){
			// 	console.log(x);
			// 	if (x < listOfSongIDs.length){
			// 		document.getElementById("currentCount").innerHTML = x+1;
			// 		try{
			// 			var sourceURL = "http://docs.google.com/uc?export=open&id=" + listOfSongIDs[x].innerHTML;
			// 			// sourceURL = cleanUpURI(sourceURL);
			// 			audioSource.src = sourceURL;
			// 			audio.load();
			// 			audio.onloadeddata = function(){
			// 				songDuration = Math.round(audio.duration);
			// 				document.getElementById(listOfSongIDs[x].innerHTML).innerHTML = songDuration;
			// 				// listOfSongIDs[x].songLength = ;
			// 				x++;
			// 			}
			// 		} catch(err){
			// 			errors++;
			// 			document.getElementById(listOfSongIDs[x].innerHTML).innerHTML = "ERROR: " + err.message;

			// 		}
					
			// 	} else {
			// 		clearInterval(getDurationLoop);
			// 		// document.getElementById("resultsObj").innerHTML = JSON.stringify(listOfSongIDs);
			// 		// writeObject();
			// 	}
			// }, 2000);
 		}
 	</script>
</body>
</html>