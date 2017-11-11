angular.module("sugarApp").service("modalContent", function($timeout){

	var modal = document.getElementById("modal");

	this.checkLocalStorage = function(){
		var storageAvailable = typeof(Storage) !== "undefined" ? true : false; 
		if (storageAvailable && (!localStorage.visited || localStorage.visited == "false")){
			this.showHelpContent(600, 500);
		} else if (storageAvailable && localStorage.leftOff){			
			if (localStorage.leftOff.toLowerCase() == "true" 
				&& new Date().getMonth()+1 == localStorage.lastMonth 
				&& new Date().getDate() == localStorage.lastDay  ){
				this.showLeftOffContent();
			}
		} else {
			console.log("No storage. Consider checking for cookie!");
		}	
	}

	this.showHelpContent = function(firstDelay, secondDelay){
		$timeout(function(){
			showModal(); 

			$timeout(function(){
				document.getElementById("welcomeContent").style.opacity = "1";
				localStorage.visited = true; 
			}, secondDelay);
		}, firstDelay);
	}

	this.showLeftOffContent = function(){
		$timeout(function(){
			showModal(); 
			document.getElementById("leftOffContent").style.height = "initial";
			$timeout(function(){
				document.getElementById("leftOffContent").style.marginTop = "10%";
				document.getElementById("leftOffContent").style.opacity = "1";
			}, 200);
		}, 500);
	}

	this.hideModal = function(){
		closeModal();
	}

	var windowListener = function(){
		window.onclick = function(event){
			if (event.target == modal){
				closeModal();
			}
		}
	}
	windowListener();

	var closeModal = function(){
		modal.style.display = "none";
		modal.style.zIndex = "-1";
			document.getElementById("leftOffContent").style.height = "0";
			document.getElementById("leftOffContent").style.marginTop = "0%";
			document.getElementById("leftOffContent").style.opacity = "0";
	}

	var showModal = function(){
		modal.style.display = "block";
		modal.style.opacity = "1";
		modal.style.zIndex = "1000";
	}
});