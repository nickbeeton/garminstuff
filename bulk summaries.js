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