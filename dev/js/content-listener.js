$('#overlay a[href*="#!"]').off('click');
$('#overlay a.popup').off('click');
$('#overlay button.popup').off('click');
$('#blackout.close, #overlay .close button').off('click');
$('#blackout.refresh, #overlay .close button').off('click');


$('#overlay a[href*="#!"]').on('click', function(){
	update_page( {service: $(this).attr('href').substr(2)} );
});

$('#overlay a.popup').on('click', function(e){
	e.preventDefault();
	popup($(this));
});

$('#overlay button.popup').on('click', function(e){
	e.preventDefault();

	console.log('form clicked');
	var id = $(this).parent('form').attr('id');
	var data = {};
	console.log('id: ' +id);

	$('#'+ id +' input, #'+ id +' textarea').each(function(index){
		console.log('input: ' + $(this).attr('name') +' / '+ $(this).val());
		data[$(this).attr('name')] = $(this).val();
	});

	console.log('DATA---');
	console.log(data);
	//data = JSON.stringify(data);
	console.log('JSON---');
	console.log(data);
	console.log('-------');
	popup($(this).parent('form'), data);
});

$('#blackout.close, #overlay .close button').on('click', function(){
	console.log('Closing Overlay');
	close_overlay();
});

$('#blackout.refresh, #overlay .refresh button').on('click', function(){
	console.log('Close/Refresh clicked');
	close_overlay();

	window.setTimeout(function(){
		console.log('Reload Page');
		location.reload(true);
	}, 500);
});

//$('#overlay .scroller').tinyscrollbar();

// Run Google Pretty if applicable
if($('pre.prettyprint, code.prettyprint').length > 0) {
	//$('pre.prettyprint, code.prettyprint').removeClass('prettyprinted');
	prettyPrint();
}
console.log('less refresh');