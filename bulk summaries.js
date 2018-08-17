/*
Use the same download location in your browser settings as for the other Javascript.

First Navigate to the last (most recent) daily summary you have in Garmin Connect (as in https://connect.garmin.com/modern/daily-summary/Bob/2018-08-17/timeline ), then hit F12 (should work in chrome/IE) to open dev tools to get to the Javascript Console. Then paste the below code and hit enter to run it. Can change ttl from 300 to whatever # of days you want to download.
If your connection is too slow to do a full download in less than 3 seconds every time, change the downloadTimeoutLength from 3 * 1000 to whatever number you want (it's 3*1000 because that's 3000 milliseconds = 3 seconds).

[CODE]*/
var a = window.location.pathname.split("/");
var id = a[a.length-2];
var da = new Date(id);
var day = new Date(86400000);
var tcxUrl = "https://connect.garmin.com/modern/proxy/download-service/files/wellness/";
var cnt = 1; ttl = 300;
var downloadTimeoutLength = 3 * 1000;

window.location.href = tcxUrl + id;

getMore = function() {
	da = new Date(da - day);
	id = da.toISOString().slice(0,10);
	window.location.href = tcxUrl + id;
	if (++cnt < ttl) {setTimeout(getMore, downloadTimeoutLength);};
	};

setTimeout(getMore, downloadTimeoutLength);
