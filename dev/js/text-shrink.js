$(function() {

function num_of_lines(e) {
	
	var height = parseInt(e.height());
	var line_height = parseInt(e.css('line-height'));
	var lines = height / line_height;

	console.log('height: '+height);
	console.log('line_height: '+line_height);
	console.log('lines: '+lines);
	console.log('--------');

	return lines;
}

var shrink_timer = new Array;
$('.s-shrink').each(function(index){

	var shrink_element = $(this);
	shrink_timer[index] = setInterval(function(){

		var lines = num_of_lines(shrink_element);
		console.log('lines: ' + lines);
		if (lines <= 1) {
			console.log('clearing timer');
			clearInterval(shrink_timer[index]);
			return true;
		} else {
			//var shrink_timer = setInterval(shrink_it(shrink_element), 1000);
		}

		var cur_size = parseInt(shrink_element.css('font-size'));
		var new_size = cur_size - 1;
		shrink_element.css('font-size', new_size);

		console.log('cur_size: ' + cur_size);
		console.log('new_size: ' + new_size);

		var cur_size = parseInt(shrink_element.css('line-height'));
		var new_size = cur_size - 1;
		shrink_element.css('line-height', new_size+'px');

		console.log('cur_size: ' + cur_size);
		console.log('new_size: ' + new_size);

		console.log('----------------');

	}, 10);
	
});

});