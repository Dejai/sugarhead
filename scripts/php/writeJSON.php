<?php

	$data = $_POST["data"];
	/* 
		This gets the raw JSON input to this PHP file.
		Got help from - https://stackoverflow.com/questions/8599595/send-json-data-from-javascript-to-php (answer by Kermit)
	*/
	$data = file_get_contents("php://input");
	echo $data;

	if (!$data){
		echo "ERROR: Data is not valid!";
	} else {
		$file = fopen("../js/songsJSON.json", "w") or die("Unable to open file!");
		fwrite($file, $data);
	}

?>
