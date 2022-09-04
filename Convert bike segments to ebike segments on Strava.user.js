// ==UserScript==
// @name         Convert bike segments to ebike segments on Strava
// @namespace    https://github.com/nickbeeton
// @version      0.6.4
// @description  Convert bike segments to ebike segments on Strava
// @author       Nick Beeton
// @match        https://www.strava.com/activities/*
// @grant        none
// ==/UserScript==

window.distbuffer = 10;

// original called function when a button is pressed
window.f = async function (boole) {
    console.log("window.f started");
    // Find all scripts in original webpage and look for the term "end_index" (indicates segments)
    window.scriptsorig = window.document.getElementsByTagName("script");
    var found;

    for (var i = 0; i < window.scriptsorig.length; i++) {
        if (window.scriptsorig[i].innerHTML.search("end_index") >= 0) {
            found = true;
            break;
        }
    }

    // if "end_index" found in a script then
    // parse all the segments described in that script
    // and save the data in global variables
    if (found) {
        window.stufforig = window.scriptsorig[i].innerHTML.split("\"achievement_description\":");
        window.namesorig = Array(window.stufforig.length - 1);
        window.start_indicesorig = Array(window.stufforig.length - 1);
        window.end_indicesorig = Array(window.stufforig.length - 1);
        for (i = 0; i < window.stufforig.length - 1; i++) // skip the last
        {
            window.namesorig[i] = window.stufforig[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"", "")
            window.start_indicesorig[i] = window.stufforig[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":", "")
            window.end_indicesorig[i] = window.stufforig[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":", "")
            console.log("Original segment " + window.namesorig[i] + " start " + window.start_indicesorig[i] + " end " + window.end_indicesorig[i]);
        }
    }
    else { // make empty arrays
        window.stufforig = Array(1);
        window.namesorig = Array(window.stufforig.length - 1);
        window.start_indicesorig = Array(window.stufforig.length - 1);
        window.end_indicesorig = Array(window.stufforig.length - 1);
    }

    // save segments bit of webpage to compare later
    window.ebikesegs = window.document.getElementsByClassName("dense hoverable marginless segments")[0];

    // open a new window (window2) to edit the e-bike ride from the original window
    // we need a new window so we can continue running script from original
    window.b1 = false;
    window.window2 = open(window.document.URL + "/edit");
    window.window2.onload = function () { if (!window.b1) { window.ff(boole); window.b1 = true; } };
    window.window2.location.reload();
};

window.z = function (boole, callback, ebike) {
    console.log("window.z started");
    window.focus();
    setTimeout(function () {
        console.log("timeout activated");
        // once all of the above is done, open the original link but now as a bike ride (now window not window2)
        if (typeof window.window2.document.getElementsByClassName("title")[0] === 'undefined') {
            window.boo = true
        }
        else {
            if (!ebike) {
                window.boo = ((window.window2.document.URL.match("edit") != null) | (window.window2.document.title.search("\\| Ride") <= 0))
            }
            else {
                window.boo = ((window.window2.document.URL.match("edit") != null) | (window.window2.document.title.search("\\| E-Bike Ride") <= 0 | window.window2.document.title.search("\\| E-Mountain Bike Ride") <= 0))
            }
        }

        if (window.boo) {
            window.z(boole, callback);
        }
        else { // wait another second
            if (window.boo2) {
                console.log("activity changed");
                callback(boole, window.j);
            }
            else {
                window.boo2 = true;
                window.z(boole, callback);
            }
        };
    }, 1000);
};

window.ff = async function (boole) {
    console.log("window.ff started");
    window.window2.focus();
    window.window2.document.getElementById('activity_sport_type').value = "Ride";
    window.window2.document.getElementsByClassName('btn-save-activity')[0].click();
    window.focus();

    // until we're back at the ride webpage
    window.boo2 = false;
    window.z(boole, window.h, false); //y);
};

// load segments from newly created bike ride
// and save in global variables
window.h = function (boole, callback) {
    console.log("window.h started");
    window.b1 = true;
    window.window2.location.reload();
    window.window2.onload = function () { if (!window.b1) { window.h(boole, callback); window.b1 = true; } };
    window.window2.location.reload();

    setTimeout(function () {
        console.log("timeout activated");

        // save segments bit of webpage to compare later
        window.bikesegs = window.window2.document.getElementsByClassName("dense hoverable marginless segments")[0];

        // if bike segments have loaded properly, keep going, else wait another second
        if (typeof window.bikesegs !== 'undefined' & window.bikesegs !== window.ebikesegs) {
            // repeat process started in window.f for the e-bike segments
            // but for the bike segments (window2 not window3)
            window.scripts = window.window2.document.getElementsByTagName("script");

            for (var i = 0; i < window.scripts.length; i++) {
                if (window.scripts[i].innerHTML.search("end_index") >= 0) {
                    break;
                }
            }

            if (i == window.scripts.length) { // if we don't actually find any segments
                console.log("No bike segments found");
            }
            else { // otherwise, store them
                console.log("Index: " + i);
                window.stuff = window.scripts[i].innerHTML.split("\"achievement_description\":");
                window.names = Array(window.stuff.length - 1);
                window.start_indices = Array(window.stuff.length - 1);
                window.end_indices = Array(window.stuff.length - 1);
                for (i = 0; i < window.stuff.length - 1; i++) // skip the last
                {
                    window.names[i] = window.stuff[i].match(/\"name\":\"[^\"]+/g)[0].replace("\"name\":\"", "")
                    window.start_indices[i] = window.stuff[i].match(/start_index\":[0-9]+/g)[0].replace("start_index\":", "")
                    window.end_indices[i] = window.stuff[i].match(/end_index\":[0-9]+/g)[0].replace("end_index\":", "")
                    console.log("Loaded segment " + window.names[i]);
                }
            }
            // now we have our data, change the ride back to e-bike ride
            // open a new window (window3) to edit the e-bike ride from the original window
            window.b1 = false;
            window.window3 = open(window.document.URL + "/edit");
            window.window3.onload = function () { if (!window.b1) { callback(boole); window.b1 = true; } };
            window.window3.location.reload();
        }
        else {
            console.log("Bike segments not loaded yet -- trying again");
            window.b1 = false;
            window.window2.location.reload();
            setTimeout(function () { if (!window.b1) { window.h(boole, callback); window.b1 = true; } },5000);
        }
    }, 2000);
};

window.w = function (boole) {
    window.window3.close();
    window.window2.close();
    window.focus();
    console.log("Segment loading done");
    // now we start making new segments, starting from the first
    window.newseg(0, boole, window.k);
}

// change ride to e-bike ride
window.j = function (boole) {
    console.log("window.j started");
    // as before, open an edit window etc
    window.window3.focus();
    window.window3.document.getElementById('activity_sport_type').value = "EBikeRide";
    window.window3.document.getElementsByClassName('btn-save-activity')[0].click();
    window.focus();
    window.boo2 = false;
    window.z(boole, window.w, true);
};

// make the i-th bike ride segment on the list
window.newseg = function (i, boole, callback) {
    console.log("window.newseg started");
    console.log("i = " + i);
    // if we get an alert message, means we've made too many segments, so give up
    if (window.document.getElementsByClassName("alert-message2").length > 0) {
        window.tms = true;
        console.log("CREATED TOO MANY SEGMENTS: exiting");
    }

    if (typeof window.names === 'undefined') { // if there are no bike segments, report and stop
        console.log("There are no bike segments to convert!")
    }
    else if (i < window.names.length & window.tms == false) { // if we haven't run out of segments and we haven't got an alert message, keep going
        window.clash = false;
        // check whether the start and end indices for the i-th bike ride segment
        // are within window.distbuffer of any existing e-bike ride segments
        // if so, report clash
        for (var j = 0; j < window.stufforig.length; j++) {
            if (Math.abs(parseInt(window.start_indices[i]) - parseInt(window.start_indicesorig[j])) < window.distbuffer & Math.abs(parseInt(window.end_indices[i]) - parseInt(window.end_indicesorig[j])) < window.distbuffer) {
                window.clash = true;
            }
        }

        // if we haven't found any position clashes, then check for segment name clashes
        if (!window.clash) {
            for (j = 0; j < window.namesorig.length; j++) {
                if (window.names[i] == window.namesorig[j]) {
                    window.clash = true;
                    console.log('Existing E-Bike segment with identical name (' + window.names[i] + ') already exists.');
                    break;
                }
            }
        }

        // if there's a clash, report it and move to the next one
        if (window.clash) {
            console.log("CLASH WITH EXISTING SEGMENT: did not create segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
            window.newseg(i + 1, boole, callback);
        } else { // call window.k which actually does the work
            window.b1 = false;
            var actno = window.document.URL.replace(/[^0-9]/g, "");
            window.window2 = open("https://www.strava.com/publishes/wizard?id=" + actno + "&origin=activity");
            window.window2.onload = function () { if (!window.b1) { callback(i, boole, window.k1); window.b1 = true; } };
            window.window2.location.reload();
        }
    }

    // check again for an alert message, which means we've made too many segments, so give up
    if (window.document.getElementsByClassName("alert-message2").length > 0) {
        window.tms = true;
        console.log("CREATED TOO MANY SEGMENTS: exiting");
    }
};


// actually start creating the segment
window.k = function (i, boole, callback) {
    console.log("window.k started");
    console.log("i = " + i);
    window.window2.focus();
    setTimeout(function () {
        console.log("timeout activated");
        if (window.window2.document.getElementsByClassName("alert-message2").length > 0) {
            window.tms = true;
            window.window2.close();
            if (window.tms) {
                console.log("CREATED TOO MANY SEGMENTS: did not create segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
            } else {
                console.log("Created segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
                window.newseg(i + 1, boole, window.k);
            }
        }
        else if (typeof window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0] === 'undefined') {
            window.k(i, boole, callback);
        }
        else {
            callback(i, boole, window.k2, 0); // call window.k1
        };
    }, 1000);
};

window.k1 = function (i, boole, callback, part) {
    window.window.focus();
    setTimeout(function () { // wait 1/2 second between parts of function
        window.window2.focus();
        if (part == 0) {
            // slightly less extremely messy way of doing it
            console.log("Creating segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
            // move start point far left and end point far right by "dragging mouse"
            window.triggerDragAndDrop(window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0], -10000, window.window2, window.window2.document);
            window.triggerDragAndDrop(window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1], 10000, window.window2, window.window2.document);
            console.log("Dragged points to edges");
            console.log("current start " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow"));
            console.log("current end " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow"));
            window.k1(i, boole, callback, 1);
        }
        else if (part == 1) {
            // test out the effect of "dragging" the start point 100 pixels right
            window.triggerDragAndDrop(window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0], 100, window.window2, window.window2.document);
            window.effect = window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow") / 100.;
            window.maxval = window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow");
            console.log("Mouse test complete");
            console.log("current start " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow"));
            console.log("current end " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow"));
            window.k1(i, boole, callback, 2);
        }
        else if (part == 2) {
            // actually move the start and end points to roughly where they should go
            window.triggerDragAndDrop(window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0], Math.round(window.start_indices[i] / effect) - 100, window.window2, window.window2.document);
            window.triggerDragAndDrop(window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1], Math.round((window.end_indices[i] - maxval) / effect), window.window2, window.window2.document);
            console.log("Initial drag and drops complete");
            console.log("current start " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow"));
            console.log("current end " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow"));
            window.k1(i, boole, callback, 3);
        }
        else if (part == 3) {
            // make minor adjustments if necessary using buttons
            // adjust end point
            var endpoint = window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow");
            if (endpoint > window.end_indices[i]) {
                for (var j = 0; j < (endpoint - window.end_indices[i]); j++) {
                    window.window2.document.querySelectorAll("*[class*=\"Button--btn--\"]")[4].click();
                    console.log("End point button press");
                }
            }
            else if (endpoint < window.end_indices[i]) {
                for (j = 0; j < (window.end_indices[i] - endpoint); j++) {
                    window.window2.document.querySelectorAll("*[class*=\"Button--btn--\"]")[5].click();
                    console.log("End point button press");
                }
            };
            window.k1(i, boole, callback, 4);
        }
        else if (part == 4) {
            // adjust start point
            var startpoint = window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow");
            if (startpoint > window.start_indices[i]) {
                for (j = 0; j < (startpoint - window.start_indices[i]); j++) {
                    window.window2.document.querySelectorAll("*[class*=\"Button--btn--\"]")[2].click();
                    console.log("Start point button press");
                }
            }
            else if (startpoint < window.end_indices[i]) {
                for (j = 0; j < (window.start_indices[i] - startpoint); j++) {
                    window.window2.document.querySelectorAll("*[class*=\"Button--btn--\"]")[3].click();
                    console.log("Start point button press");
                }
            };
            window.k1(i, boole, callback, 5);
        }
        else if (part == 5) {
            console.log("button pressing done");
            console.log("current start " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[0].getAttribute("aria-valuenow"));
            console.log("current end " + window.window2.document.querySelectorAll("*[class*=\"Handle--slider--\"]")[1].getAttribute("aria-valuenow"));
            window.window2.document.querySelectorAll("*[class*=\"StepActions--next--\"]")[0].click();
            callback(i, boole); // call window.k2
        };
    }, 500);
}

// wait for segment name data to appear on page
window.k2 = function (i, boole) {
    console.log("window.k2 started");
    console.log("i = " + i);
    setTimeout(function () {
        console.log("timeout activated");

        if (window.window2.document.getElementById("segment_name") == null) { // if it's not there yet
            if (window.window2.document.querySelectorAll("*[class*=\"Step2--list--\"]")[0] == null) {
                if (window.window2.document.querySelectorAll("*[class*=\"Step1--error--\"]")[0] != null) { // segment too short
                    console.log("Segment too short: did not create segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
                    window.newseg(i + 1, boole, window.k);
                }
                else {
                    console.log("Nothing loaded yet");
                    window.k2(i, boole); // try again in 1 second
                }
            }
            else if (typeof window.window2.document.querySelectorAll("*[class*=\"Step2--list--\"]")[0] !== 'undefined') { // if we're getting the "Verify Similar Segments" question, verify and click next
                console.log("Verify similar segments message");
                window.window2.document.querySelectorAll("*[class*=\"Step2--list--\"]")[0].firstElementChild.firstElementChild.firstElementChild.click();
                window.window2.document.querySelectorAll("*[class*=\"StepActions--next--\"]")[0].click();
                window.k2(i, boole); // try again in 1 second
            }
            else { // something else??
                console.log("Unknown error: did not create segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
                window.newseg(i + 1, boole, window.k);
            }
        }
        else { // once the segment name is available, make final changes and create segment
            window.window2.document.getElementById("segment_name").value = window.names[i];
            window.window2.document.getElementsByName("private")[0].checked = boole;
            window.window2.document.querySelectorAll("*[class*=\"StepActions--next--\"]")[0].disabled = false;
            window.window2.document.querySelectorAll("*[class*=\"StepActions--next--\"]")[0].click();
            //window.window2.close();
            if (window.tms) {
                console.log("CREATED TOO MANY SEGMENTS: did not create segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
            } else {
                console.log("Created segment " + window.names[i] + " start " + window.start_indices[i] + " end " + window.end_indices[i]);
                window.newseg(i + 1, boole, window.k);
            }
        };
    }, 1000);
};

window.f1 = function () {
    window.f(false, window.g);
};

window.f2 = function () {
    window.f(true, window.g);
};

window.f3 = function () {
    window.alert("You have created too many segments - try again later.")
};

// code taken gratefully from https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/
window.triggerDragAndDrop = function (elemDrag, xchange, win, doc) {

    // function for triggering mouse events
    var fireMouseEvent = function (type, elem, centerX, centerY) {
        var evt = doc.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, win, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
        elem.dispatchEvent(evt);
    };

    // fetch target elements
    var elemDrop = doc;
    if (!elemDrag || !elemDrop) return false;

    // calculate positions
    var pos = elemDrag.getBoundingClientRect();
    var center1X = Math.floor((pos.left + pos.right) / 2);
    var center1Y = Math.floor((pos.top + pos.bottom) / 2);
    var center2X = center1X + xchange;
    var center2Y = center1Y;

    // mouse over dragged element and mousedown
    fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);
    fireMouseEvent('mouseover', elemDrag, center1X, center1Y);
    fireMouseEvent('mousedown', elemDrag, center1X, center1Y);

    // start dragging process over to drop target
    fireMouseEvent('dragstart', elemDrag, center1X, center1Y);
    fireMouseEvent('drag', elemDrag, center1X, center1Y);
    fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    fireMouseEvent('drag', elemDrag, center2X, center2Y);
    fireMouseEvent('mousemove', elemDrop, center2X, center2Y);

    // trigger dragging process on top of drop target
    fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);
    fireMouseEvent('dragenter', elemDrop, center2X, center2Y);
    fireMouseEvent('mouseover', elemDrop, center2X, center2Y);
    fireMouseEvent('dragover', elemDrop, center2X, center2Y);

    // release dragged element on top of drop target
    fireMouseEvent('drop', elemDrop, center2X, center2Y);
    fireMouseEvent('dragend', elemDrag, center2X, center2Y);
    fireMouseEvent('mouseup', elemDrag, center2X, center2Y);

    return true;
};

if ((window.document.title.search("E-Bike Ride") > 0 | window.document.title.search("E-Mountain Bike Ride") > 0) & window.document.getElementsByClassName("icon-edit").length > 0) { // your own ebike ride
    window.tms = (window.document.getElementsByClassName("alert-message2").length > 0)

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

    if (window.tms) {
        btn1.onclick = window.f3;
        btn2.onclick = window.f3;
        btn1.classname = "minimal button"
        btn2.classname = "minimal button"
    }
};
