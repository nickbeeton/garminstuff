// ==UserScript==
// @name         Convert bike segments to ebike segments on Strava
// @namespace    https://github.com/nickbeeton
// @version      0.1
// @description  Convert bike segments to ebike segments on Strava
// @author       Nick Beeton
// @match        https://www.strava.com/activities/*
// @grant        none
// ==/UserScript==

if (window.document.getElementsByClassName("title")[0].innerHTML.search("E-Bike Ride") > 0){
    var btn = window.document.createElement("BUTTON"); // Create a <button> element
    btn.innerHTML = "Copy Bike Segments to Ebike Segments"; // Insert text
    btn.onclick = window.f;
    window.document.getElementsByClassName("activity-description-container")[0].appendChild(btn);
}

window.f = function(){
	window.scriptsorig = window.document.getElementsByTagName("script");
	for (var i = 0; i < window.scriptsorig.length; i++){
		if (window.scriptsorig[i].innerHTML.search("end_index") >= 0){
				break;
        }
	}
	window.stufforig = window.scriptsorig[i].innerHTML.split("\"achievement_description\":");
	window.namesorig = Array(window.stufforig.length - 1);
	window.start_indicesorig = Array(window.stufforig.length - 1);
	window.end_indicesorig = Array(window.stufforig.length - 1);
	//privatesorig = Array(stufforig.length - 1);
	//hiddensorig = Array(stufforig.length - 1);
	for (i = 1; i < window.stufforig.length; i++) // skip the first
	{
		window.namesorig[i-1] = window.stufforig[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"","")
		window.start_indicesorig[i-1] = window.stufforig[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":","")
		window.end_indicesorig[i-1] = window.stufforig[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":","")
		//privatesorig[i-1] = stufforig[i].match(/private_segment\":[^,]+/g)[0].replace("private_segment\":","")
		//hiddensorig[i-1] = stufforig[i].match(/hidden_by_athlete\":[^}]+/g)[0].replace("hidden_by_athlete\":","")
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
			//privates = Array(stuff.length - 1);
			//hiddens = Array(stuff.length - 1);
			for (i = 1; i < window.stuff.length; i++) // skip the first
			{
				window.names[i-1] = window.stuff[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"","")
				window.start_indices[i-1] = window.stuff[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":","")
				window.end_indices[i-1] = window.stuff[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":","")
				console.log("Loaded segment "+window.names[i-1]);
				//privates[i-1] = stuff[i].match(/private_segment\":[^,]+/g)[0].replace("private_segment\":","")
				//hiddens[i-1] = stuff[i].match(/hidden_by_athlete\":[^}]+/g)[0].replace("hidden_by_athlete\":","")
			}

			setTimeout((window.j = function(){
				window2 = open(window.document.URL+"/edit");
				window2.focus();
				window2.onload = function() { // once it's loaded, change it to e-bike and save
					window2.document.getElementById('activity_type').value = "EBikeRide";
					window2.document.getElementsByClassName('btn-save-activity')[0].click();
					window3.close();
					window2.close();
				};
				console.log("Segment loading done");
				window.newseg(0);
			}), 5000);
		}), 5000);
	}), 5000);
};

window.newseg = function(i){
	var distbuffer = 10;

	if (i < window.names.length){
		window.clash = false;
		for (var j = 0; j < window.scriptsorig.length; j++){
			if (Math.abs(parseInt(window.start_indices[i]) - parseInt(window.start_indicesorig[j])) < distbuffer & Math.abs(parseInt(window.end_indices[i]) - parseInt(window.end_indicesorig[j])) < distbuffer){
				var clash = true;
            }
		}

		if (clash){
			console.log("CLASH WITH EXISTING SEGMENT: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i])
        } else {
			setTimeout((window.k = function(){
				var actno = window.document.URL.replace(/[^0-9]/g, "");
				var window2 = open("https://www.strava.com/publishes/wizard?id="+actno+"&origin=activity");
				window2.focus();
				window2.onload = function() {
					window2.document.getElementById("segment_name").value = window.names[i];
					window2.document.getElementById("segment-start-index").value = window.start_indices[i];
					window2.document.getElementById("segment-end-index").value = window.end_indices[i];
					window2.document.getElementsByClassName("callout")[0].click();
					window2.close();
				};
				console.log("Created segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i])
				window.newseg(i+1);
			}), 5000);
		}
	}
}
