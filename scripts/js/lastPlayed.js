var storageAvailable; 

document.addEventListener("DOMContentLoaded", function(){
		if (typeof(Storage) !== "undefiend"){
			storageAvailable = true;
			// console.log("We've got storage");
		} else {
			storageAvailable = false;
			// console.log("No storage");
		}
	}, true);


window.addEventListener("OnBeforeUnload", function(){
	alert("Closing time?");
	localStorage.test = "Closing Time";
}, true);