// ==UserScript==
// @name         Convert bike rides to ebike rides on Strava
// @namespace    https://github.com/nickbeeton
// @version      0.1
// @description  Convert bike rides to ebike rides on Strava
// @author       Nick Beeton
// @match        https://www.strava.com/athletes/*
// @grant        none
// ==/UserScript==

window.f = function(i){
    if (document.getElementsByClassName('icon-ride icon-dark').length > 1){ // if rides detected
        if (document.getElementsByClassName('icon-ride icon-dark')[i].title === "")	{ // if it's not just the ride goal logo
            var window2 = open(window.document.getElementsByClassName('icon-ride icon-dark')[i].parentElement.parentElement.nextElementSibling.firstElementChild.href+"/edit"); // open a new edit window for the ride
            window2.focus();
            window2.onload = function() { // once it's loaded, change it to e-bike and save
                var drop = window2.document.getElementById('activity_type');
                drop.value = "EBikeRide";
                window2.document.getElementsByClassName('btn-save-activity')[0].click();
                setTimeout((window.g = function(){ // then after a delay, close the window and start the proces again for the next ride
                    window2.close();
                    window.f(i+1);
                }), 10000); // amount of time (in ms) to wait till starting on the next file
            };
        };
    };
};
window.f(0);
