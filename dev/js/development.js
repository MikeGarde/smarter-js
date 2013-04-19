
function sjOverlay(bgurl) {

	$('body').append("<div id=\"sj-overlay\" style=\"background-image: url('"+bgurl+"');\"></div><a href=\"#\" id=\"sj-overlay-toggle\">toggle</a>\n\<div id=\"sj-overlay-slider\" style=\"height: 200px;\"></div>");
	
	$('a#sj-overlay-toggle').click(function(e){
		e.preventDefault();

		$('#sj-overlay').toggle();
	});

	$(function() {
		$("#sj-overlay-slider").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 40,
			slide: function( event, ui ) {
				ui.value = ui.value / 100;
				$('#sj-overlay').css({'opacity' : ui.value, 'display' : 'block'});
			}
		});
		//$( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
	});
}

$(document).ready(function() {



});