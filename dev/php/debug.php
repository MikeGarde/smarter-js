<?php

/**
 * Like print_r() but so much better! Removes HTML formatting from an array while using Google Prittify.
 *
 * @author  Mike Garde
 *
 * @param array    $array   Array you want to see.
 * @param boolean  $die     Should this kill the process when done?
 * @param boolean  $return  Do you want this echoed or returned
 *
 * @return string A view of an array but formatted for easy reading via HTML.
 */
function print_a($array, $die=true, $return=false) {

	if(!$array) {
		$array = $GLOBALS;
	}

	$array = object_to_array($array);
	$array = print_r($array, true);
	$array = preg_replace('/\[(.*[a-zA-Z]{1}.*)\] => /i', '[\'$1\'] => ', $array);
	$array = preg_replace('/ => (.*[a-zA-Z!@#$%\^&\*:]{1}.*)\n/i', " => '$1'\n", $array);
	$array = preg_replace('/ => \'Array\'/i', " => Array", $array);
	$array = htmlspecialchars($array);
	$array = str_replace(array('    ', "\t"), '&nbsp;&nbsp;&nbsp;&nbsp;', $array);

	$string = '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.js"></script>';
	$string.= '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/lang-css.js"></script>';
	$string.= '<link rel="stylesheet" type="text/css" href="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.css">';
	$string.= '<link href="//fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet" type="text/css">';
	$string.= '<style>';
	$string.= 'pre { background-color: #fff; font-family: \'Ubuntu Mono\', sans-serif; }';
	$string.= 'li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal; }';
	$string.= 'ol { padding: 0 0 0 45px; }';
	$string.= '</style>';
	$string.= '<pre class="prettyprint linenums">'. $array .'</pre>';
	$string.= '<script>prettyPrint();</script>';

	if ($return) {
		return $string;
	} else {
		echo $string;
	}

	if ($die)
		die();
}


/**
 * Converts an object into an array
 *
 * @author  Mike Garde
 *
 * @param object   $object    Object you want to make into an array
 * @param boolean  $truncate  Object you want to make into an array
 *
 * @return An Array!
 */
function object_to_array($object, $truncate=false) {
	foreach($object as $key => $value) {
		if(is_object($object) || is_array($object)) {
			$object[$key] = object_to_array($value);
		} else {
			$object = ($truncate) ? truncate($value) : $value;
		}
	}
	return $object;
}


/**
 * Truncate a string
 *
 * @author  Mike Garde
 *
 * @param string   $string  String you want to truncate
 * @param number   $len     Leingth you wish to trunicate the string to
 * @param string   $append  What should be appended to the end of the string
 * @param boolean  $strict  True  = will not excede the $len param
 *                          False = will find the trunication point and move to the end of the previous word using char,
 *                                  OR the end of the word (using word),
 *                                  OR the end of the current sentence (using sentence)
 *
 * @param string   $type    'char'     = count the number of characters
 *                          'word'     = count the number of words
 *							'sentence' = counts characters but looks for the end of a sentence
 *
 * @return A trunicated string
 */
function truncate($string, $len=137, $append='...', $strict=true) {

	if($strict)
		$return = substr($string, 0, $len);

	return $return.$append;
}


function generate_large_array($size=60, $depth=2) {
	//echo 'generating large array: '.$size.' / '.$depth.'<br>';
	$i = 1;

	while ($i <= $size) {
		if($depth == 0) {
			$value = rand(5, 99999);
			//echo $i.' / '. $depth .' : '. $value .'<br>';
			$return[$i] = $value;
		} else {
			$new_size = round(($size / ($depth + 3)), 0, PHP_ROUND_HALF_UP);
			if($new_size < 3)
				$new_size = 3;
			$return[$i] = generate_large_array($new_size, $depth-1);
		}
		$i++;
	}
	return $return;
}