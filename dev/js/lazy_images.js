// onScreen jQuery plugin v0.2.1
// (c) 2011 Ben Pickles
//
// http://benpickles.github.com/onScreen
//
// Released under MIT license.
;(function(jQuery) {
  jQuery.expr[":"].onScreen = function(elem) {
    var $window = jQuery(window)
    var viewport_top = $window.scrollTop()
    var viewport_height = $window.height()
    var viewport_bottom = viewport_top + viewport_height
    var $elem = jQuery(elem)
    var top = $elem.offset().top
    var height = $elem.height()
    var bottom = top + height

    return (top >= viewport_top && top < viewport_bottom) ||
           (bottom > viewport_top && bottom <= viewport_bottom) ||
           (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
  }
})(jQuery);
// onScreen Done



window.onload=function() {

jQuery('img:onScreen[data-src]').each(function(){
	jQuery(this).attr('src', jQuery(this).attr('data-src'));
	jQuery(this).removeAttr('data-src');
});

jQuery(document).scroll(function(){
	jQuery('img:onScreen[data-src]').each(function(){
		jQuery(this).attr('src', jQuery(this).attr('data-src')).stop(true,true).hide().fadeIn(300);
		jQuery(this).removeAttr('data-src');
	});
});
	
}