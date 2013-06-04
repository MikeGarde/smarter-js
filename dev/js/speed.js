window.onload = function () {

$('a.show').click(function(e){
	e.preventDefault();
	$('img.'+$(this).attr('rel')).css({display: 'block'});
});


$(this).hide();

var now = Date.now();
//var page_load_time = performance.timing.domComplete - performance.timing.navigationStart;
var page_load_time = now - performance.timing.navigationStart;
var log;
var time;
var width;

// Prompt for Unload
$('#performance .prompt').width('1%');
$('#performance .prompt span').append('<abbr>?</abbr>');
log = 'Prompt for Unload will never be known<br />';

// Redirect
if(performance.timing.redirectEnd == 0) {
	$('#performance .redirect').hide();
	log = log + 'There was NO redirect<br />';
} else {
	time  = performance.timing.redirectEnd - performance.timing.redirectStart;
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .redirect').width(width+'%');
	$('#performance .redirect span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// App Cache
time  = performance.timing.domainLookupStart - performance.timing.fetchStart;
if(time == 0){
	$('#performance .cache').hide();
	log = log + 'There was NO cache<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .cache').width(width+'%');
	$('#performance .cache span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// DNS
time  = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
if(time == 0){
	$('#performance .dns').hide();
	log = log + 'There was NO DNS<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .dns').width(width+'%');
	$('#performance .dns span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// TCP
time  = performance.timing.connectEnd - performance.timing.connectStart;
if(time == 0){
	$('#performance .tcp').hide();
	log = log + 'There was NO TCP<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .tcp').width(width+'%');
	$('#performance .tcp span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// Request
time  = performance.timing.responseStart - performance.timing.requestStart;
if(time == 0){
	$('#performance .request').hide();
	log = log + 'There was NO Request<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .request').width(width+'%');
	$('#performance .request span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// Response
time  = performance.timing.responseEnd - performance.timing.responseStart;
if(time == 0){
	$('#performance .response').hide();
	log = log + 'There was NO Response<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .response').width(width+'%');
	$('#performance .response span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// Unload
time  = performance.timing.unloadEventEnd - performance.timing.unloadEventStart;
if(time == 0){
	$('#performance .unload').hide();
	log = log + 'There was NO Processing Unload<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .unload').width(width+'%');
	$('#performance .unload span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// Processing
time  = performance.timing.domComplete - performance.timing.domLoading;
if(time == 0){
	$('#performance .processing').hide();
	log = log + 'There was NO Response<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .processing').width(width+'%');
	$('#performance .processing span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// DOM
time  = performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart;
if(time == 0){
	$('#performance .dom').hide();
	log = log + 'There was NO DOM<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .dom').width(width+'%');
	$('#performance .dom span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

// Load
time  = now - performance.timing.loadEventStart;
if(time == 0){
	$('#performance .load').hide();
	log = log + 'There was NO Load (javascript)<br />';
} else {
	width = (time / page_load_time) * 100;
	if(width > 90) width = 60;
	$('#performance .load').width(width+'%');
	$('#performance .load span').append('<abbr title="'+time+'ms">'+time+'</abbr>');
}

log = log + '<br />User-perceived page loading time: ' + page_load_time;

$('div#log').html(log);
console.log(performance);

};