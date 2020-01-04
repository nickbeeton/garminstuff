// ==UserScript==
// @name         Convert bike segments to ebike segments on Strava
// @namespace    https://github.com/nickbeeton
// @version      0.5.1
// @description  Convert bike segments to ebike segments on Strava
// @author       Nick Beeton
// @match        https://www.strava.com/activities/*
// @grant        none
// ==/UserScript==

window.distbuffer = 10;

// original called function when a button is pressed
window.f = async function(boole){
	console.log("window.f started");
	// Find all scripts in original webpage and look for the term "end_index" (indicates segments)
	window.scriptsorig = window.document.getElementsByTagName("script");
    var found;

    for (var i = 0; i < window.scriptsorig.length; i++){
        if (window.scriptsorig[i].innerHTML.search("end_index") >= 0){
            found = true;
            break;
        }
    }

	// if "end_index" found in a script then  
	// parse all the segments described in that script
	// and save the data in global variables
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
    else { // make empty arrays
        window.stufforig = Array(1);
        window.namesorig = Array(window.stufforig.length - 1);
        window.start_indicesorig = Array(window.stufforig.length - 1);
        window.end_indicesorig = Array(window.stufforig.length - 1);
    }

	// open a new window (window2) to edit the e-bike ride from the original window
    // we need a new window so we can continue running script from original
	window.b1 = false;
	window.window2 = open(window.document.URL+"/edit");
	window.window2.onload = function() {if (!window.b1) {window.ff(boole); window.b1 = true;}};
	window.window2.location.reload();
};

window.z = function(boole, callback, ebike) {
	setTimeout(function(){
		console.log("timeout activated");
		// once all of the above is done, open the original link but now as a bike ride (now window not window2)
		if (typeof window.window2.document.getElementsByClassName("title")[0] === 'undefined'){
            window.boo = true
        }
        else {
            if (!ebike){
                window.boo = ((window.window2.document.URL.match("edit") != null) | (window.window2.document.getElementsByClassName("title")[0].innerHTML.search("\nRide") <= 0))
            }
            else{
                window.boo = ((window.window2.document.URL.match("edit") != null) | (window.window2.document.getElementsByClassName("title")[0].innerHTML.search("E-Bike Ride") <= 0))
            }
        }
        
        if (window.boo){
			window.z(boole, callback);
		}
		else{ // wait another second
            if (window.boo2) {
                console.log("activity changed");
                callback(boole, window.j);
            }
            else{
                window.boo2 = true;
                window.z(boole, callback);
            }
		};
	}, 1000);
};

window.ff = async function(boole){
	console.log("window.ff started");
	window.window2.focus();
	window.window2.document.getElementById('activity_type').value = "Ride";
	window.window2.document.getElementsByClassName('btn-save-activity')[0].click();

	// until we're back at the ride webpage
    window.boo2 = false;
	window.z(boole, window.h, false); //y);
};

// load segments from newly created bike ride
// and save in global variables
window.h = function(boole, callback){
	console.log("window.h started");
	// close edit window, no longer needed
	//window.window2.close();
	
	// repeat process started in window.f for the e-bike segments 
	// but for the bike segments (window2 not window3)
	window.scripts = window.window2.document.getElementsByTagName("script");

	for (i = 0; i < window.scripts.length; i++){
		if (window.scripts[i].innerHTML.search("end_index") >= 0){
				break;
		}
	}
	
    if (i == window.scripts.length){ // if we don't actually find any segments
        console.log("No bike segments found");
    }
    else // otherwise, store them
    {
        console.log("Index: "+i);
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
    }
	// now we have our data, change the ride back to e-bike ride
	// open a new window (window3) to edit the e-bike ride from the original window
	window.b1 = false;
	window.window3 = open(window.document.URL+"/edit");
	window.window3.onload = function() {if (!window.b1) {callback(boole); window.b1 = true;}};
	window.window3.location.reload();
};

window.w = function(boole){
	window.window3.close();
	window.window2.close();
	console.log("Segment loading done");
	// now we start making new segments, starting from the first
	window.newseg(0, boole, window.k);
}

// change ride to e-bike ride
window.j = function(boole){
	console.log("window.j started");
	// as before, open an edit window etc
	window.window3.focus();
	window.window3.document.getElementById('activity_type').value = "EBikeRide";
	window.window3.document.getElementsByClassName('btn-save-activity')[0].click();
	window.boo2 = false;
    window.z(boole, window.w, true);
};

// make the i-th bike ride segment on the list
window.newseg = function(i, boole, callback){
	console.log("window.newseg started");
    console.log("i = " + i);
	// if we get an alert message, means we've made too many segments, so give up
	if (window.document.getElementsByClassName("alert-message").length > 0){
		window.tms = true;
		console.log("CREATED TOO MANY SEGMENTS: exiting");
	}
	
	// if we haven't run out of segments and we haven't got an alert message, keep going
	if (i < window.names.length & window.tms == false){
		window.clash = false;
		// check whether the start and end indices for the i-th bike ride segment 
		// are within window.distbuffer of any existing e-bike ride segments
		// if so, report clash
		for (var j = 0; j < window.stufforig.length; j++){
			if (Math.abs(parseInt(window.start_indices[i]) - parseInt(window.start_indicesorig[j])) < window.distbuffer & Math.abs(parseInt(window.end_indices[i]) - parseInt(window.end_indicesorig[j])) < window.distbuffer){
				window.clash = true;
            }
		}

		// if we haven't found any position clashes, then check for segment name clashes
		if (!window.clash) {
		  for (j = 0; j<window.namesorig.length; j++) {
			if (window.names[i] == window.namesorig[j]) {
			  window.clash = true;
			  console.log('Existing E-Bike segment with identical name (' + window.names[i] + ') already exists.');
			  break;
			}
		  }
		}

		// if there's a clash, report it and move to the next one
		if (window.clash){
			console.log("CLASH WITH EXISTING SEGMENT: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
			window.newseg(i+1, boole, callback);
        } else { // call window.k which actually does the work
			window.b1 = false;
            var actno = window.document.URL.replace(/[^0-9]/g, "");
            window.window2 = open("https://www.strava.com/publishes/wizard?id="+actno+"&origin=activity");
            window.window2.onload = function() {if (!window.b1) {callback(i, boole, window.k2); window.b1 = true;}};
            window.window2.location.reload();
		}
	}
	
	// check again for an alert message, which means we've made too many segments, so give up
	if (window.document.getElementsByClassName("alert-message").length > 0){
		window.tms = true;
		console.log("CREATED TOO MANY SEGMENTS: exiting");
	}
};


// actually start creating the segment
window.k = function(i, boole, callback){
    console.log("window.k started");
    console.log("i = " + i);
    window.window2.focus();
    setTimeout(function(){
        console.log("timeout activated");
        if (window.window2.document.getElementsByClassName("alert-message").length > 0){
            window.tms = true;
            window.window2.close();
            if (window.tms){
                console.log("CREATED TOO MANY SEGMENTS: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
            } else {
                console.log("Created segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
                window.newseg(i+1, boole, window.k);
            }
        } 
        else if (typeof window.window2.document.getElementsByClassName("Handle--slider--qH0x_")[0] === 'undefined'){
            window.k(i, boole, callback);
        } 
        else {
            // extremely messy way of doing it
            
            // adjust end point
            endpoint = window.window2.document.getElementsByClassName("Handle--slider--qH0x_")[1].getAttribute("aria-valuenow");
            if (endpoint > window.end_indices[i]){
                for (var j = 0; j < (endpoint - window.end_indices[i]); j++)
                    window.window2.document.getElementsByClassName("Button--btn--2ry0z")[4].click();
            }
            else if (endpoint < window.end_indices[i]){
                for (var j = 0; j < (window.end_indices[i] - endpoint); j++)
                    window.window2.document.getElementsByClassName("Button--btn--2ry0z")[5].click();                
            };
            
            // adjust start point
            startpoint = window.window2.document.getElementsByClassName("Handle--slider--qH0x_")[0].getAttribute("aria-valuenow");
            if (startpoint > window.start_indices[i]){
                for (var j = 0; j < (startpoint - window.start_indices[i]); j++)
                    window.window2.document.getElementsByClassName("Button--btn--2ry0z")[2].click();
            }
            else if (startpoint < window.end_indices[i]){
                for (var j = 0; j < (window.start_indices[i] - startpoint); j++)
                    window.window2.document.getElementsByClassName("Button--btn--2ry0z")[3].click();                
            };
            
            setTimeout(function(){ // give it a second to deal with all those button presses...
                window.window2.document.getElementsByClassName("StepActions--next--3gzyo")[0].click();
                callback(i, boole); // call window.k2
            }, 1000);
        };
    }, 1000);
};

// wait for segment name data to appear on page
window.k2 = function(i, boole) {
    console.log("window.k2 started");
    console.log("i = " + i);
	setTimeout(function(){
		console.log("timeout activated");
		
        if (window.window2.document.getElementById("segment_name") == null){ // if it's not there yet
            if (window.window2.document.getElementsByClassName("Step2--list--3eZrD") == null){
                window.k2(i, boole); // try again in 1 second
            }
            else if (typeof window.window2.document.getElementsByClassName("Step2--list--3eZrD")[0] !== 'undefined'){ // if we're getting the "Verify Similar Segments" question, verify and click next 
                window.window2.document.getElementsByClassName("Step2--list--3eZrD")[0].firstElementChild.firstElementChild.firstElementChild.click();
                window.window2.document.getElementsByClassName("StepActions--next--3gzyo")[0].click();
            }
            else { // if the segment is too short
                console.log("Segment too short: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
                window.newseg(i+1, boole, window.k);
            }
		}
		else{ // once the segment name is available, make final changes and create segment
            window.window2.document.getElementById("segment_name").value = window.names[i];
            window.window2.document.getElementsByName("private")[0].checked = boole;
            window.window2.document.getElementsByClassName("StepActions--next--3gzyo")[0].disabled = false;
            window.window2.document.getElementsByClassName("StepActions--next--3gzyo")[0].click();
            //window.window2.close();
            if (window.tms){
                console.log("CREATED TOO MANY SEGMENTS: did not create segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
            } else {
                console.log("Created segment "+window.names[i]+" start "+window.start_indices[i]+" end "+window.end_indices[i]);
                window.newseg(i+1, boole, window.k);
            }
		};
	}, 1000);
};

window.f1 = function(){
    window.f(false, window.g);
};

window.f2 = function(){
    window.f(true, window.g);
};

window.f3 = function(){
	window.alert("You have created too many segments - try again later.")
};

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
};
