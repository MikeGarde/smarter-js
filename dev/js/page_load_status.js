
function get_all_images(){
	var url;
	var assets = [];
	var ele = document.getElementsByTagName('*');

	console.log('there are '+ele.length+' elements to check');

	for (var i=0; i<ele.length; i++) {

		if(ele[i].tagName == 'IMG') {
			url = ele[i].src;
		} else {
			url = window.getComputedStyle(ele[i], null).getPropertyValue('background-image');
			if(url) url=/url\(['"]?([^")]+)/.exec(url) || [];
			url= url[1];
		}
		if(url && assets.indexOf(url)== -1) {
			assets[assets.length] = url;
		}
	}

	return assets;
}

var imgs = get_all_images();
var load_check = document.getElementById('load_check');
console.log('---------------');
console.log(imgs);

function build_load_check(element, index, array) {
	var new_img = document.createElement('img');
	new_img.setAttribute('src', element);

	load_check.appendChild(new_img);
}
imgs.forEach(build_load_check);


var imgs_count_initial  = 0;
var imgs_count_complete = 0;
var preloader_progress = document.getElementById('preloader_progress');
var loading_interval = window.setInterval(loading_runner,10);

function loading_runner() {
	imgs = load_check.getElementsByTagName('img');
	var continue_run = false;

	if(imgs_count_initial === 0)
		imgs_count_initial = imgs.length;

	for (var i=0; i<imgs.length; i++) {
		if(imgs[i].complete === false) {
			continue_run = true;
		} else {
			imgs[i].parentNode.removeChild(imgs[i]);
			imgs_count_complete++;
		}
	}

	preloader_progress.style.width = ((imgs_count_complete / imgs_count_initial)*100)+'%';
	console.log('status: '+ imgs_count_complete +' / '+ imgs_count_initial);


	if(continue_run === false) {
		preloader_progress.style.width = '100%';
		window.clearInterval(loading_interval);
		loading_interval = null;
	}
}

load_check.parentNode.removeChild(load_check);