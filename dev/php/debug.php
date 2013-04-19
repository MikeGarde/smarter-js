<?php

/**
 * Like print_r() but so much better! Removes HTML formatting from an array while using Google Prittify.
 *
 * @author  Mike Garde
 *
 * @param array   $array  Array you want to see.
 * @param boolean $die    Should this kill the process when done?
 * @param boolean $return Do you want this echoed or returned
 *
 * @return string A view of an array but formatted for easy reading via HTML.
 */
function print_a($array, $die = true, $return = false) {

	if(!$array) {
		$array = $GLOBALS;
		foreach ($array as &$item){
			if(is_array($item) || is_object($item))
				$item = null;
		}
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
	$string.= 'pre { font-family: \'Ubuntu Mono\', sans-serif; }';
	$string.= 'li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal; }';
	$string.= 'ol { padding: 0 0 0 45px; }';
	$string.= '</style>';
	$string.= '<pre class="prettyprint linenums">';
	$string.= $array;
	$string.= '</pre>';
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
 * @param object  $object Object you want to make into an array
 *
 * @return An Array!
 */
function object_to_array($object) {
	foreach($object as $key => $value) {
		if(is_object($object)) {
			$object[$key] = self::object_to_array($value);
		}
	}
	return (array)$object;
}