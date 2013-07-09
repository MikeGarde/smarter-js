// For example visit
// http://www.thecreativecoast.org/to-be-or-not-to-be-an-entrepreneur/
$(window).ready(function(){
	$('div.entry-content img').each(function(){
		$(this).css({'max-width' : $(this).attr('width')+'px', 'max-height' : $(this).attr('height')+'px', 'width' : '100%'});
		$(this).removeAttr('width').removeAttr('height');
	});
});