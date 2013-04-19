var updateProgressInterval;

/*
 * Get value of 'name' parameter from URL
 */
function getParam(name,url){
	name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS="[\\?&]"+name+"=([^&#]*)";
	var regex=new RegExp(regexS);
	var results=regex.exec(url);
	return(results==null)?"":results[1];
}

/*
 * Whatcha doin'?
 */
function getFileType(itemSrc){
	if(itemSrc.match(/youtube\.com\/watch/i)||itemSrc.match(/youtu\.be/i)){
		return 'youtube';
	}else if(itemSrc.match(/vimeo\.com/i)){
		return 'vimeo';
	}else if(itemSrc.match(/\b.mov\b/i)){
		return 'quicktime';
	}else if(itemSrc.match(/\b.swf\b/i)){
		return 'flash';
	}else if(itemSrc.match(/\biframe=true\b/i)){
		return 'iframe';
	}else if(itemSrc.match(/\bajax=true\b/i)){
		return 'ajax';
	}else if(itemSrc.match(/\bcustom=true\b/i)){
		return 'custom';
	}else if(itemSrc.match(/\b.jpg\b/i)){
		return 'image';
	}else if(itemSrc.substr(0,2)=='#~'){
		return 'ajax';
	}else if(itemSrc.substr(0,1)=='#'){
		return 'inline';
	}else{
		return false;
	};
}

/*
 * Go get a script (the script will be run)
 */
function getScript(scripturl) {

	$.ajax({
		url: scripturl,
		cache : true,
		dataType: 'script',
		success: function(data) {
			console.log('Load GOOD: '+ scripturl);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log('Load FAILED------> '+ scripturl);
			console.log('XMLHttpRequest---> '+ XMLHttpRequest);
			console.log('textStatus-------> '+ textStatus);
			console.log('errorThrown------> '+ errorThrown);
			console.log('-----------------------------');
		}
	});

}


/*
 * Go get a some JSON and put it on the page
 */
function update_page(ajaxurl, postData){

	var future_scripts = [];
	var future_functions = [];
	var pop_it = false;

	if(postData === undefined) var postData = {};
	var method = (postData.length === undefined) ? 'POST' : 'GET';

	console.log('ajax, lets make this happen');
	console.log('method: ' + method);

	if(method == 'POST')
		postData['location'] = document.URL;

	$.ajax( {
		url:		ajaxurl,
		data:		postData,
		dataType:	'json',
		type:		method,
		timeout:	30000,
		success:	function(data) {
						console.log('ajax call successfull');
						console.log(data);

						$('pre[data-target="dump"]').html( dump(data, 'return') );

						$.each(data, function(index, value){
							console.log(index);

							switch (index) {
								case 'progress':
									$.each(value, function(index, value){
										console.log(index + ': ' + value);
										progress_bar(index, value);
									});
									break;
								case 'target':
									$.each(value, function(index, value){
										console.log(index + ': ' + value);
										$('.ajax_targetable [data-target="'+index+'"]').html( value );

										if(index == 'popup'){
											pop_it = true;
										}
									});
									break;
								case 'script':
									$.each(value, function(index, value){
										future_scripts.push(value);
									});
									break;
								case 'function':
									$.each(value, function(index, value){
										future_functions.push(value);
									});
									break;
								case 'action':
									if(value == 'refresh'){
										location.reload(true);
									} else {
										$.each(value, function(index, value){
											console.log(index + ': ' + value);
											switch (index) {
												case 'location':
													window.location = value;
													break;
											}
										});
									}
									break;

							}
						});


						if(pop_it == true){
							console.log('Time Saved This it is so True')
							adjustOverlayPos(future_scripts);
						} else {
							$.each(future_scripts, function(index, value) {
								getScript(value);
							});
							$.each(future_functions, function(index, value) {
								window[value]();
							});
						}
						
					},
		error:		function() {
						$('#blackout').click();
						updateProgressInterval = window.clearInterval(updateProgressInterval);
						alert('Oops! I couldn\'t "phone home". Please refresh the page and I\'ll try to do better.');
					}

	});

}

function adjustOverlayPos(future_scripts){

	if(future_scripts == undefined) var future_scripts = [];

	var viewport_height = $('#blackout').height();
	console.log('viewport_height: ' + viewport_height);

	$('#overlay').css('margin-top', height * -1.5);
	$('#overlay').show();

	var paddingLR =	parseInt( $('#overlay').css('padding-right').replace(/[^-\d\.]/g, '') )
				  + parseInt( $('#overlay').css('padding-left').replace(/[^-\d\.]/g, '') );

	var paddingTB =	parseInt( $('#overlay').css('padding-top').replace(/[^-\d\.]/g, '') )
				  + parseInt( $('#overlay').css('padding-bottom').replace(/[^-\d\.]/g, '') );

	console.log('paddingTB: ' + paddingTB);
	console.log('paddingLR: ' + paddingLR);

	var width  = $('#overlay_holder').width();
	var height = $('#overlay_holder').height();

	console.log('width: ' + width);
	console.log('height: ' + height);

	var full_width  = paddingLR + width;
	var full_height = paddingTB + height;

	console.log('full_width: ' + full_width);
	console.log('full_height: ' + full_height);

	var margin_top = (viewport_height * 0.5) - (full_height * 0.5);
	console.log('margin_top: ' + margin_top);

	$('#overlay').animate({
		width: width,
		height: height,
		'margin-top': margin_top,
		'margin-left': (full_width * -0.5)
	}, 800, 'easeOutCirc', function() {

		$('#overlay').html( $('#overlay_holder').html() );
		$('#overlay_holder').html('empty');

		$.each(future_scripts, function(index, value) {
			getScript(value);
		});
		getScript('../js/content-listener.js');
	});

	console.log('------------POPUP DONE------------');
}




/*
 *
 * LISTENER FUNCTIONS
 *
 */
function popup(element, data){

	$('#overlay_holder').html( $('#overlay_reference').html() );

	if(data == undefined) var data = new Array();

	var src = element.attr('href');
	if (typeof src == 'undefined' || src == false)
		var src = element.attr('action');

	var type = getFileType(src);
	var title = element.attr('data-title');
	var width = element.attr('data-width');
	var height = element.attr('data-height');
	var link = element.attr('data-link');
	var action = element.attr('data-action');

	console.log('src: ' + src);
	console.log('Popup Type: '+ type);
	console.log(data);

	if(title == undefined)
		title = '';

	if(link == undefined) {
		action = '';
		$('#overlay .footer').hide();
	} else {
		action = '<a href="'+ link +'" class="button">'+ action +'</a>';
		$('#overlay .footer').show();
	}

	switch(type){
		case'image':

		break;
		case'youtube':
			if(width == undefined)
				width = 853;
			if(height == undefined)
				height = 480;

			movie = getParam('v',src);
			if(movie==""){
				movie = src.split('youtu.be/');
				movie = movie[1];
				if(movie.indexOf('?')>0)
					movie = movie.substr(0,movie.indexOf('?'));
				if(movie.indexOf('&')>0)
					movie = movie.substr(0,movie.indexOf('&'));
			}
			link = 'http://www.youtube.com/embed/'+movie;
			(getParam('rel',src)) ? link += "?rel="+getParam('rel',src) : link += "?rel=1";
			link += "&autoplay=1";
			break;

		case'vimeo':

			var regExp=/http(s)?:\/\/(www\.)?vimeo.com\/(\d+)/;
			var match = src.match(regExp);
			console.log('match: ' + match)
			var link = 'http://player.vimeo.com/video/'+match[3]+'?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1';
			console.log('link: ' + link)
			break;

		case'quicktime':

			break;
		case'flash':

			break;
		case'iframe':

			var link = src;

			$('#blackout.close').removeClass('close').addClass('refresh');
			$('#overlay_holder .close').removeClass('close').addClass('refresh');

			break;
		case'ajax':

			update_page(src, data);
			var content = '';

		break;
		case'custom':

			break;
		case'inline':

			break;
		case'image':

			break;
	};

	if(width == undefined)
		width = 800;
	if(height == undefined)
		height = (width * 9) / 16;

	switch(type){
		case'youtube':
		case'vimeo':
		case'iframe':

			var content = '<iframe src="'+ link +'" width="'+ width +'" height="'+ height +'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

		break;
		case'image':

			var content = '<img src="'+ src +'" width="'+ width +'" height="'+ height +'" />';

			break;
	}

	console.log('type: ' + type);
	console.log('width: ' + width);
	console.log('height: ' + height);
	console.log('content: ' + content);

	$('#blackout').fadeIn(500);

	$('#overlay_holder .header h3').html(title);
	$('#overlay_holder .body').html( content );
	$('#overlay_holder .footer').html(action);

	if(type != 'ajax') {
		adjustOverlayPos();
	}
}

function close_overlay(){

	var new_margin = Math.round( $('#overlay').outerHeight() * -1.1 );
	console.log('new_margin: ' + new_margin);

	$('#overlay').stop().animate({
		marginTop: new_margin
	}, 750, function() {
		console.log('Overlay Animation Done');
		$('#overlay').hide().html('').width(0).height(0).css('margin-left', 0);
		$('#blackout').fadeOut(500);
	});
}

function esc_key(e){
	if(e.keyCode== 27) {
		console.log('esc key hit');
		close_overlay();
	}
}



/*
 *
 * The Listeners
 *
 */
$(document).ready(function(){

	$('a[href*="#!"]').click(function(){
		update_page( { service: $(this).attr('href').substr(2) } );
	});

	$('a.popup').click(function(e){
		e.preventDefault();
		popup($(this));
	});

	$('button.popup').click(function(e){

	});

	$('form.ajax').submit(function() {
		var url = $(this).attr('action');
		var post_data = $(this).children('input').serialize();
		update_page(url, post_data);
		return false;
	});

	$(document).keyup(function(e) {
		esc_key(e);
	});
	getScript('../js/content-listener.js');
});



/*
 * Progress Bar
 */
$(document).ready(function(){

	$('.progress.started .bar').each(function(){

		if( $(this).attr('data-start') ){
			$(this).width($(this).attr('data-start')+'%');
		}

		var newwidth = $(this).attr('data-complete');
		$(this).animate({
			width: newwidth + '%'
		}, 1000, function() {	});
	});

	function bgscroll(){
		// 1 pixel row at a time
		current -= 1;

		// move the background with backgrond-position css properties
		$('.progress.started .bar').css("backgroundPosition", (direction == 'h') ? current+"px 0" : "0 " + current+"px");
	}

	//Calls the scrolling function repeatedly
	var scrollSpeed = 70;
	var current = 0;
	var direction = 'h';
	setInterval(bgscroll, scrollSpeed);


	// Auto Update Progress Bar
	function autoUpdateProgress(){

		var progressArray = new Array();
		var count = 0;

		$('div.progress.live').each(function() {
			progressArray[count] = $(this).attr('data-target');
			count++;
		});

		if(progressArray.length > 0) {
			progressArray = { progress: progressArray }
			update_page(progressArray);
		}
	}
	var updateSpeed = 10000;
	updateProgressInterval = self.setInterval(autoUpdateProgress, updateSpeed);

});
