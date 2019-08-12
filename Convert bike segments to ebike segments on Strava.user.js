// ==UserScript==
// @name         Convert bike segments to ebike segments on Strava
// @namespace    https://github.com/nickbeeton
// @version      0.3
// @description  Convert bike segments to ebike segments on Strava
// @author       Nick Beeton
// @match        https://www.strava.com/activities/*
// @grant        none
// ==/UserScript==

window.f = function(boole){
    window.scriptsorig = window.document.getElementsByTagName("script");
    var found;

    for (var i = 0; i < window.scriptsorig.length; i++){
        if (window.scriptsorig[i].innerHTML.search("end_index") >= 0){
            found = true;
            break;
        }
    }

    if(found) {
        window.stufforig = window.scriptsorig[i].innerHTML.split("\"achievement_description\":");
        window.namesorig = Array(window.stufforig.length - 1);
        window.start_indicesorig = Array(window.stufforig.length - 1);
        window.end_indicesorig = Array(window.stufforig.length - 1);
        for (i = 1; i < window.stufforig.length; i++) // skip the first
        {
            window.namesorig[i-1] = window.stufforig[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"","")
            window.start_indicesorig[i-1] = window.stufforig[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":","")
            window.end_indicesorig[i-1] = window.stufforig[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":","")
            console.log("Original segment "+window.namesorig[i-1]+" start "+window.start_indicesorig[i-1]+" end "+window.end_indicesorig[i-1]);
        }
    }
    else {
        window.stufforig = Array(1);
        window.namesorig = Array(window.stufforig.length - 1);
        window.start_indicesorig = Array(window.stufforig.length - 1);
        window.end_indicesorig = Array(window.stufforig.length - 1);
    }

	var window2 = open(window.document.URL+"/edit");
	window2.focus();
	window2.onload = function() { // once it's loaded, change it to bike and save
		window2.document.getElementById('activity_type').value = "Ride";
		window2.document.getElementsByClassName('btn-save-activity')[0].click();
		window2.close();
	};

	setTimeout((window.g = function(){
		var window3 = open(window.document.URL);
		setTimeout((window.h = function(){
			window.scripts = window3.document.getElementsByTagName("script");

			for (i = 0; i < window.scripts.length; i++){
				if (window.scripts[i].innerHTML.search("end_index") >= 0){
						break;
                }
			}

			window.stuff = window.scripts[i].innerHTML.split("\"achievement_description\":");
			window.names = Array(window.stuff.length - 1);
			window.start_indices = Array(window.stuff.length - 1);
			window.end_indices = Array(window.stuff.length - 1);
			for (i = 1; i < window.stuff.length; i++) // skip the first
			{
				window.names[i-1] = window.stuff[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"","")
				window.start_indices[i-1] = window.stuff[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":","")
				window.end_indices[i-1] = window.stuff[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":","")
				console.log("Loaded segment "+window.names[i-1]);
			}

			setTimeout((window.j = function(){
				window2 = open(window.document.URL+"/edit");
				window2.focus();
				window2.onload = function() { // once it's loaded, change it to e-bike and save
					window2.document.getElementById('activity_type').value = "EBikeRide";
					window2.document.getElementsByClassName('btn-save-activity')[0].click();
					window3.close();
					window2.close();
                    window.focus(); // doesn't work, try again later
				};
				console.log("Segment loading done");
				window.newseg(0, boole);
			}), 5000);
		}), 5000);
	}), 5000);
};

window.newseg = function(i, boole){
	window.distbuffer = 10;
	if (window.document.getElementsByClassName("alert-message").length > 0){
		window.tms = true;
		console.log("CREATED TOO MANY SEGMENTS: exiting");
	}
	if (i < window.names.length & window.tms == false){
		window.clash = false;
		for (var j = 0; j < window.stufforig.length; j++){
			if (Math.abs(parseInt(window.start_indices[i]) - parseInt(window.start_indicesorig[j])) < window.distbuffer & Math.abs(parseInt(window.end_indices[i]) - parseInt(window.end_indicesorig[j])) < window.distbuffer){
				window.clash = true;
            }
		}

		if (window.clash){
			console.log("CLASH WITH EXISTING SEGMENT: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
			window.newseg(i+1, boole);
        } else {
			setTimeout((window.k = function(){
				var actno = window.document.URL.replace(/[^0-9]/g, "");
				var window2 = open("https://www.strava.com/publishes/wizard?id="+actno+"&origin=activity");
				window2.focus();
				window2.onload = function() {
					if (window2.document.getElementsByClassName("alert-message").length > 0){
						window.tms = true;
						window2.close();
					} else {
						window2.document.getElementById("segment_name").value = window.names[i];
						window2.document.getElementById("segment-start-index").value = window.start_indices[i];
						window2.document.getElementById("segment-end-index").value = window.end_indices[i];
						window2.document.getElementById("private").checked = boole;
						window2.document.getElementsByClassName("callout")[0].click();
						window2.close();
					}
				};
				if (window.tms){
					console.log("CREATED TOO MANY SEGMENTS: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
				} else {
					console.log("Created segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
					window.newseg(i+1, boole);
				}
			}), 5000);
		}
	}
	if (window.document.getElementsByClassName("alert-message").length > 0){
		window.tms = true;
		console.log("CREATED TOO MANY SEGMENTS: exiting");
	}
}

window.f1 = function(){
    window.f(false);
}

window.f2 = function(){
    window.f(true);
}

window.f3 = function(){
	window.alert("You have created too many segments - try again later.")
}

if (window.document.getElementsByClassName("title")[0].innerHTML.search("E-Bike Ride") > 0 & window.document.getElementsByClassName("icon-edit").length > 0){ // your own ebike ride
	window.tms = (window.document.getElementsByClassName("alert-message").length > 0)

	var btn1 = window.document.createElement("BUTTON"); // Create a <button> element
    btn1.innerHTML = "Copy Bike Segments to PUBLIC Ebike Segments"; // Insert text
    btn1.onclick = window.f1;
    btn1.className = 'btn-primary btn-xs';
    window.document.getElementsByClassName("activity-description-container")[0].appendChild(btn1);

    var btn2 = window.document.createElement("BUTTON"); // Create a <button> element
    btn2.innerHTML = "Copy Bike Segments to PRIVATE Ebike Segments"; // Insert text
    btn2.onclick = window.f2;
    btn2.className = 'btn-primary btn-xs';
    window.document.getElementsByClassName("activity-description-container")[0].appendChild(btn2);

	if (window.tms){
		btn1.onclick = window.f3;
		btn2.onclick = window.f3;
		btn1.classname = "minimal button"
		btn2.classname = "minimal button"
	}

}
