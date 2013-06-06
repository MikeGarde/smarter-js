jQuery(function() {

function num_of_lines(e) {
	var height = parseInt(e.height());
	var line_height = parseInt(e.css('line-height'));
	var lines = height / line_height;

	return lines;
}

var shrink_timer = new Array;
jQuery('.s-shrink').each(function(index){

	var shrink_element = jQuery(this);
	shrink_timer[index] = setInterval(function(){

		var lines = num_of_lines(shrink_element);

		if (lines <= 1) {
			clearInterval(shrink_timer[index]);
			return true;
		}

		var cur_size = parseInt(shrink_element.css('font-size'));
		var new_size = cur_size - 1;
		shrink_element.css('font-size', new_size);

		var cur_size = parseInt(shrink_element.css('line-height'));
		var new_size = cur_size - 1;
		shrink_element.css('line-height', new_size+'px');

	}, 10);

}); // end .s-shrink each

}); // document ready