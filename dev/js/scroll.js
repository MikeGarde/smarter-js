
var scroller = '';

$(function() {

var sso = { };
function refresh_options() {
	sso = {
		axis		: 'y',
		scroll		: 70,
		height		: {
			viewport	: $(this).find('.viewport').height(),
			fullview	: $(this).find('.fullview').height(),
			track		: $(this).find('.track').height()
			},
		pos			: {
			fullview	: parseInt( $(this).find('.fullview').css('top') ),
			track		: parseInt( $(this).find('.track').css('top') )
			},
		move_to		: null,
		bounce_back : false,
		bounce_pos	: 0
	}
}

function track_height(inner, outer) {
	var r = inner / outer;
	if(r < 0.05)
		r = 0.05;
	return r * inner;
}

function fade_track(element, amount) {
	if( !element.children('.track').hasClass('dragging') ){
		element.children('.track').stop().animate({
			opacity: amount
		}, 400, 'easeInOutExpo', function() {

		});
	}
}


var touchEvents = 'ontouchstart' in document.documentElement;

if( touchEvents ) {
	
} else {
	// Setup Desktop Page
	$('.smarter-scroll').each(function(index){
		$(this).wrapInner('<div class="fullview" style="top:0;">');
		$(this).append('<div class="scrollbar"><div class="track"></div></div>');
		$(this).wrapInner('<div class="viewport">');
		$(this).children('.viewport').css('position', 'relative');
		var natural = $(this).children('.viewport').height();

		$(this).children('.viewport').children('.fullview').css('height', natural);

		if(natural > $(window).height()) {
			$(this).children('.viewport').css('position', '');
			var display = $(this).children('.viewport').height();

			$(this).children('.viewport').find('.scrollbar .track').css('height', track_height(display, natural));
		} else {
			$(this).children('.viewport').children('.scrollbar').css('display', 'none');
		}
		refresh_options();
	});

	$('.smarter-scroll').bind('mousewheel', function(e){
		var me			= $(this);
		var viewport	= $(this).find('.viewport');
		var fullview	= $(this).find('.fullview');
		var track		= $(this).find('.track');
		var cur_pos		= parseInt( fullview.css('top') );
		var new_pos		= null;
		var bounce_back = false;
		var bounce_pos	= 0;

		// Which direction?
		if(e.originalEvent.wheelDelta >= 0) {
			new_pos = cur_pos + 70;
		} else{
			new_pos = cur_pos - 70;
		}

		console.log('viewport: ' + viewport.height());
		console.log('cur_pos: '+cur_pos);
		console.log('new_pos: '+new_pos);

		// Are we close to the top or bottom?
		if(new_pos > 100) {
			new_pos = 100;
		} else if( ((new_pos * -1) + viewport.height() - 100) > fullview.height() ) {
			new_pos = ((fullview.height() * -1) + viewport.height() - 100);
		}

		// Are we over extended?
		if(new_pos > 0) {
			bounce_back = true;
			bounce_pos	= 0;
		} else if( ((new_pos * -1) + viewport.height()) > fullview.height() ) {
			bounce_back = true;
			bounce_pos	= ((fullview.height() * -1) + viewport.height());
		}

		// Move Track
		var h_full = parseInt( fullview.height() );
		var h_view = parseInt( viewport.height() );

		if(bounce_back == false) {
			var track_pos = ((new_pos * -1) / h_full) * h_view;
		} else {
			var track_pos = ((bounce_pos * -1) / h_full) * h_view;
		}

		track.stop().animate({
			opacity: 0.35,
			top: track_pos
		}, 80, 'easeInOutExpo', function() {
			//$(this).delay(400).animate({
			//	opacity: 0.025
			//}, 1300, 'easeInOutExpo');
		});

		// Move content
		fullview.stop().animate({
			top: new_pos
		}, 400, 'easeOutCubic', function() {

			if(bounce_back) {
				fullview.stop().animate({
					top: bounce_pos
				}, 350, 'easeOutBack', function() {
					// Animation complete.
				});
/*
				track_pos = ((new_pos *-1) / h_full) * h_view;

				track.stop().animate({
					opacity: 0.35,
					top: track_pos
				}, 500, 'easeOutQuart', function() {
					console.log('ran move_track (bounce back)');
					//track_pos = ((cur_pos *-1) / h_full) * h_view;
					$(this).animate({
						opacity: 0.025
					}, 1200, 'easeInOutExpo');
				});
*/
			}

			track_pos = ((new_pos *-1) / h_full) * h_view;

			track.stop().delay(400).animate(
				(bounce_back) ? { opacity: 0.025 } : { opacity: 0.025, top: track_pos }, 1200, 'easeInOutExpo');
		});

	});


	$('.smarter-scroll .scrollbar').mouseenter(function(){
		fade_track($(this), 0.35);
	}).mouseleave(function(){
		fade_track($(this), 0.025);
	});

	var mouse_pos = null;
	$('.track').draggable({
		containment: "parent",
		start: function() {
			console.log('dragstart');
			$(this).addClass('dragging');
			mouse_pos = event.pageY;
		},
		drag: function() {
			
			var base		= $(this).parent('.scrollbar').parent('.viewport').parent('.smarter-scroll');
			var viewport	= base.find('.viewport');
			var fullview	= base.find('.fullview');
			var track		= $(this);
			var track_pos	= parseInt( track.css('top') );
			var new_pos		= -1 * ((track_pos + event.pageY - mouse_pos) / (viewport.height() - track.height())) * (fullview.height() - viewport.height());

			console.log(event);
			console.log('(track_pos + event.pageY - mouse_pos): ' + (track_pos + event.pageY - mouse_pos));
			console.log('mouse_pos: ' + mouse_pos);
			console.log('event.layerY: ' + event.layerY);
			console.log('change: ' + (mouse_pos - event.pageY));
			console.log('track_pos: ' + track_pos);
			console.log('new_pos: ' + new_pos);
			console.log('------------');
			
			// Are we over extended?
			if(new_pos > 0)
				new_pos = 0;
			if(new_pos < (-1 * (fullview.height() - viewport.height())))
				new_pos = (-1 * (fullview.height() - viewport.height()));

			fullview.stop().animate({
				top: new_pos
			}, 100, 'easeOutBack', function() {
				// Animation complete.
			});

			
		},
		stop: function() {
			/*
			var base		= $(this).parent('.scrollbar').parent('.viewport').parent('.smarter-scroll');
			var viewport	= base.find('.viewport');
			var fullview	= base.find('.fullview');
			var track		= $(this);
			var new_pos		= -1 * (parseInt( track.css('top') ) / (viewport.height() - track.height())) * (fullview.height() - viewport.height());

			console.log('track.css(\'top\'): ' + track.css('top'));
			console.log('viewport.height(): ' + viewport.height());
			console.log('track.height(): ' + track.height());
			console.log('fullview.height(): ' + fullview.height());
			console.log('new_pos: ' + new_pos);

			track.removeClass('dragging');

			// Are we over extended?
			if(new_pos > 0)
				new_pos = 0;
			if(new_pos < (-1 * (fullview.height() - viewport.height())))
				new_pos = (-1 * (fullview.height() - viewport.height()));

			fullview.stop().animate({
				top: new_pos
			}, 100, 'easeOutBack', function() {
				fade_track($(this).parent(), 0.025);
			});

			*/
		}

	});

}

});


/*
	$(document).keyup(function(e) {
		if(e.keyCode== 27) {
			$('#blackout').click();
		}
	});
*/