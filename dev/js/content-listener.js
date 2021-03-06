jQuery('#sj_overlay a[href*="#!"]').off('click');
jQuery('#sj_overlay a.popup').off('click');
jQuery('#sj_overlay button.popup').off('click');
jQuery('#sj_blackout.sj_close, #sj_overlay .sj_close button').off('click');
jQuery('#sj_blackout.refresh, #sj_overlay .sj_close button').off('click');


jQuery('#sj_overlay a[href*="#!"]').on('click', function(){
	update_page( {service: jQuery(this).attr('href').substr(2)} );
});

jQuery('#sj_overlay a.popup').on('click', function(e){
	e.preventDefault();
	popup(jQuery(this));
});

jQuery('#sj_overlay button.popup').on('click', function(e){
	e.preventDefault();

	console.log('form clicked');
	var id = jQuery(this).parent('form').attr('id');
	var data = {};
	console.log('id: ' +id);

	jQuery('#'+ id +' input, #'+ id +' textarea').each(function(index){
		console.log('input: ' + jQuery(this).attr('name') +' / '+ jQuery(this).val());
		data[jQuery(this).attr('name')] = jQuery(this).val();
	});

	console.log('DATA---');
	console.log(data);
	//data = JSON.stringify(data);
	console.log('JSON---');
	console.log(data);
	console.log('-------');
	popup(jQuery(this).parent('form'), data);
});

jQuery('#sj_blackout.sj_close, #sj_overlay .sj_close button').on('click', function(){
	console.log('Closing Overlay');
	close_overlay();
});

jQuery('#sj_blackout.refresh, #sj_overlay .refresh button').on('click', function(){
	console.log('Close/Refresh clicked');
	close_overlay();

	window.setTimeout(function(){
		console.log('Reload Page');
		location.reload(true);
	}, 500);
});

//jQuery('#sj_overlay .scroller').tinyscrollbar();

// Run Google Pretty if applicable
if(jQuery('pre.prettyprint, code.prettyprint').length > 0) {
	//jQuery('pre.prettyprint, code.prettyprint').removeClass('prettyprinted');
	prettyPrint();
}
console.log('less refresh');