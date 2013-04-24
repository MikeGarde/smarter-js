
var sso = { };
function setup_sso() {
	sso = {
		axis		: null,
		yScroll		: 70,   // in pixels
		xScroll		: 750,  // in miliseconds
		pages		: {
			hash		: null,
			current		: 1,
			begining	: true,
			end			: true,
			count		: 0
		},
		flip_to		: null,
		bounce_back : false,
		bounce_pos	: 0,
		run_active  : true,
		touch		: {
			start		: {
				x			: 0,
				y			: 0
			},
			end		: {
				x			: 0,
				y			: 0
			},
			diff	: {
				x			: 0,
				y			: 0,
				ratio		: 0
			}
		}
	}
}
function update_sso() {
	
	var sso2 = {
		viewport	: {
			width	: $(window).width(),
			height	: $(window).height()
		},
		fullview	: {
			width	: $(window).width() * sso.pages.count,
			height	: $('#' + sso.pages.hash).height()
		},
		track	: {
			height	: $(window).width()
		}
	};

    var sso3 = {};

    for (var attrname in sso ) { sso3[attrname] = sso[attrname]; }
    for (var attrname in sso2) { sso3[attrname] = sso2[attrname]; }

    sso = sso3;

	sso.pages.count = 0;
	$('.ss-page').each(function(index){
		$(this).height('auto')
		var natural = $(this).height();
		$(this).css('height', natural);
		sso.pages.count++;
		$(this).attr('data-pageCount', sso.pages.count);
		$(this).attr('data-left', '');
	});
	console.log(sso);
}

function make_page_active() {

	if(sso.axis)
		return false;
	
	if(!sso.flip_to) {
		var cur_pos = Math.abs( parseInt( $('.ss-page[data-pageCount="1"]').css('left') ) );
		console.log('cur_pos: ' + cur_pos);
		sso.flip_to = (cur_pos / sso.viewport.width) + 1;
		console.log('sso.flip_to: ' + sso.flip_to);
	}

	$('.ss-page').removeClass('ss-active');
	$('.ss-page[data-pageCount="'+sso.flip_to+'"]').addClass('ss-active');

	sso.pages.hash = $('.ss-page[data-pageCount="'+sso.flip_to+'"]').attr('id');
	sso.pages.current = sso.flip_to;
	sso.pages.begining = (sso.flip_to == 1) ? true : false;
	sso.pages.end = (sso.flip_to == sso.pages.count) ? true : false;
	
	sso.fullview.height	= $('.ss-active').height();

	if(sso.flip_to != 1)
		location.hash = sso.pages.hash;
	else
		location.hash = '';
	
	sso.flip_to = null;
	sso.viewport.position = parseInt( $('.ss-page.ss-active').css('top') );
	
	console.log(sso);
}


// Setup Pages
function initiate_pages() {
	var pos_left = sso.viewport.width * -1;
	$('.ss-page').each(function(index){
		pos_left += sso.viewport.width;
		$(this).css({
			top : 0,
			left : pos_left,
			width : sso.viewport.width,
			position : 'absolute'
		});
	});
	$('.viewport').css('width', sso.viewport.width);
	update_sso();
	$('.ss-page[data-pageCount="1"]').addClass('ss-active');
	if(location.hash === '') {
		sso.pages.hash = $('.ss-page[data-pageCount]').attr('id');
		sso.pages.current = 1;
		sso.fullview.height	= $('.ss-active').height();
	} else {
		console.log('hash set, need to move user');
		//flip_to(location.hash, 800)
	}
	sso.viewport.position = parseInt( $('.ss-page.ss-active').css('top') );
	console.log(sso);
}

function update_pages() {

}

function flip_to(hash, delay) {
	console.log('flipp_to running');

	if(isInt(hash)) {
		console.log(' as int: ' + hash);

		if(hash > sso.pages.count)
			hash = sso.pages.count;
		
		if(hash < 1)
			hash = 1;
		
		if($('.ss-page[data-pageCount="'+hash+'"]').length == 0){
			location.hash = '';
			return false;
		}
		var pos_end = hash;
		hash = $('.ss-page[data-pageCount="'+hash+'"]').attr('id');

	} else {
		if(hash.substring(0, 1) == '#')
			hash = hash.substring(1);

		console.log(' as hash: ' + hash);

		if($(hash+'.ss-page').length === 0){
			location.hash = '';
			return false;
		}
		var pos_end   = parseInt( $(hash+'.ss-page').attr('data-pageCount') );
	}

	console.log('flip_to running: ' + hash);

	var pos_start = sso.pages.current;
	var pos_diff  = (pos_end - pos_start) * sso.viewport.width;

	console.log('pos_start: ' + pos_start);
	console.log('pos_end: ' + pos_end);
	console.log('pos_diff: ' + pos_diff);

	if($('.ss-page[data-pageCount="'+pos_start+'"]').attr('data-left').length !== 0) {
		pos_diff = pos_diff + parseInt($('.ss-page[data-pageCount="'+pos_start+'"]').css('left'));
	}

	var direction = null;

	if(pos_diff !== 0) {
		sso.flip_to = pos_end;
		if(pos_diff > 0){
			direction = 'next';
		} else {
			direction = 'prev';
			pos_diff  = Math.abs(pos_diff);
		}

		var time = sso.xScroll * (2/3);

		if(delay === undefined)
			delay = 0;
		else
			time = sso.xScroll;

		flip_page(direction, pos_diff, time, delay);
	}

	if(pos_end === 1)
		location.hash = '';

	console.log('flipping from: ' + sso.pages.current);
	console.log('flipping to  : ' + $('#'+hash+'.ss-page').attr('data-pageCount'));
	console.log('flipping diff: ' + pos_diff);
	console.log('flipping dir : ' + direction);
}

function flip_page(direction, new_pos, time, delay) {

	if(new_pos == undefined)
		new_pos = sso.viewport.width;

	if(time == undefined)
		time = sso.xScroll;

	if(delay == undefined)
		delay = 0;

	new_pos = '=' + new_pos;

	if(direction == 'next') {
		new_pos = '-' + new_pos;
	} else if(direction == 'prev') {
		new_pos = '+' + new_pos;
	}

	flip_action(new_pos, time, delay);
}


function flip_action(new_pos, time, delay) {
	console.log('new_pos: ' + new_pos);
	if(time==undefined)
		time = sso.xScroll;

	if(delay == undefined)
		delay = 0;

	$('.ss-page').delay(delay).animate({
		left: new_pos
	}, time, function() {
		make_page_active();
	});
}



//
// Document Ready
//
$(function() {

	setup_sso();
	
	//
	// Hash Link Clicked
	//
	$('a[href^="#"]').click(function (e) {
		e.preventDefault;

		var hash = this.href;
		hash = '#' + hash.replace(/^.*#/, '');

		console.log('hash click: ' +hash);

		flip_to(hash);
		return false;
	});

	//
	// Touch Events
	//
	var touchEvents = 'ontouchstart' in document.documentElement;
	if(touchEvents) {
		$('.viewport').bind('touchstart', function(e) {
			//e.preventDefault();
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			sso.axis = null;
			console.log('touchstart');
			sso.touch.start.x = touch.pageX;
			sso.touch.start.y = touch.pageY;

			$('.ss-page').each(function(){
				$(this).attr('data-left', parseInt($(this).css('left')));
			});
		});
		$('.viewport').bind('touchmove', function(e) {
			e.preventDefault();
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			sso.touch.end.x = touch.pageX;
			sso.touch.end.y = touch.pageY;
			
			//console.log(touch.pageY+' '+touch.pageX);
			
			sso.touch.diff = {
				x : sso.touch.start.x - sso.touch.end.x,
				y : sso.touch.start.y - sso.touch.end.y
			};
			sso.touch.diff.ratio = Math.abs(sso.touch.diff.x) / Math.abs(sso.touch.diff.y);
			//console.log(sso.touch.diff);

			if(!sso.axis) {

				if( (Math.abs(sso.touch.diff.x) > 20) || (Math.abs(sso.touch.diff.y) > 20) ) {

					if(sso.touch.diff.ratio < 0.5) {
						sso.axis = 'y';
						console.log('up or down');
					} else if(sso.touch.diff.ratio > 4) {
						sso.axis = 'x';
						console.log('right or left');
					}

				}

			} else {

				if(sso.axis == 'y') {



				} else if(sso.axis == 'x') {
				
					$('.ss-page').each(function(){
						var new_pos = $(this).attr('data-left') - sso.touch.diff.x;
						$(this).css({left: new_pos});
					});
				}
			}
		});
		$('.viewport').bind('touchend', function(e) {
			//e.preventDefault();
			console.log('touchend');


			if(sso.axis == 'y') {

			} else if(sso.axis == 'x') {
				console.log(sso);
				//if((sso.pages.current == 1) && (parseInt($('.ss-page.ss-active').css('left')) > 0)) {
				//	flip_to(1);
				//} else {
					console.log(sso.touch.diff);
					if(sso.touch.diff.x < -(sso.viewport.width / 3.5))
						flip_to(sso.pages.current - 1);
					else if(sso.touch.diff.x > (sso.viewport.width / 3.5))
						flip_to(sso.pages.current + 1);
					else
						flip_to(sso.pages.current);
				//}

			}

			$('.ss-page').attr('data-left', '');

			sso.axis = null;
			console.log(sso);
			//el.css("-webkit-transform", "translate3d(0, 0, 0)");
		});
	}


	//
	// Scroll Bar Functions
	//
	function track_height(inner, outer) {
		var r = inner / outer;
		if(r < 0.05)
			r = 0.05;
		return r * inner;
	}
	function track_fade(element, amount) {
		if( !element.children('.track').hasClass('dragging') ){
			element.children('.track').stop().animate({
				opacity: amount
			}, 400, 'easeInOutExpo', function() {

			});
		}
	}
	//
	// Scroll Bar Actions
	//
	if( !touchEvents ) {

		$('.smarter-scroll .scrollbar').mouseenter(function(){
			track_fade($(this), 0.35);
		}).mouseleave(function(){
			track_fade($(this), 0.025);
		});

		$('.smarter-scroll').bind('mousewheel', function(e){
			var new_pos		= null;
			var bounce_back = false;
			var bounce_pos	= 0;

			// Which direction?
			if(e.originalEvent.wheelDelta >= 0) {
				new_pos = sso.viewport.position + sso.yScroll;
			} else{
				new_pos = sso.viewport.position - sso.yScroll;
			}

			// Are we close to the top or bottom?
			if(new_pos > 100) {
				new_pos = 100;
			} else if( ((new_pos * -1) + sso.viewport.height - 100) > sso.fullview.height ) {
				new_pos = ((sso.fullview.height * -1) + viewport.height() - 100);
			}

			// Are we over extended?
			if(new_pos > 0) {
				bounce_back = true;
				bounce_pos	= 0;
			} else if( ((new_pos * -1) + sso.viewport.height) > sso.fullview.height ) {
				bounce_back = true;
				bounce_pos	= ((sso.fullview.height * -1) + sso.viewport.height);
			}

			// Move Track
			if(bounce_back == false) {
				var track_pos = ((new_pos * -1) / sso.fullview.height) * sso.viewport.height;
			} else {
				var track_pos = ((bounce_pos * -1) / sso.fullview.height) * sso.viewport.height;
			}

			$('.track').stop().animate({
				opacity: 0.35
			}, 50, 'easeInOutExpo', function() {
				$(this).stop().animate({
					top: track_pos
				}, 200, 'easeInOutExpo', function() {
					track_pos = ((new_pos * -1) / sso.fullview.height) * sso.viewport.height;
					$(this).delay(400).animate({
						opacity: 0.025,
						top: track_pos
					}, 1300, 'easeInOutExpo');
				});
			});

			// Move content
			$('.ss-page.ss-active').stop().animate({
				top: new_pos
			}, 400, 'easeOutCubic', function() {

				if(bounce_back) {
					$('.ss-page.ss-active').stop().animate({
						top: bounce_pos
					}, 350, 'easeOutBack', function() {
						// Animation complete.
					});
				}

			});

			sso.viewport.position = (bounce_back) ? bounce_pos : new_pos;
		});

	}

});


//
// Document Ready and Images Loaded
//
$(window).load(function() {

	update_sso();
	initiate_pages();
	console.log(location);
	console.log('done');

});


//
// Document Resized
//
$(window).resize(function() {

	update_sso();
	console.log(sso);
	
});



// Key Hit
$(document).keyup(function(e) {

	switch(e.keyCode) {
		case 32:
			// 32 = space
			break;
		case 33:
			// 33 = page up
			break;
		case 34:
			// 34 = page down
			break;
		case 35:
			// 35 = end
			break;
		case 36:
			// 36 = home
			break;
		case 37:
			// 37 = left
			console.log('left key hit');
			flip_page('prev');
			break;
		case 38:
			// 38 = up
			break;
		case 39:
			// 39 = right
			console.log('right key hit');
			flip_page('next');
			break;
		case 40:
			// 40 = down
			break;
	}
});