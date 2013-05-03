<?php

/**
 * Like print_r() but so much better! Removes HTML formatting from an array while using Google Prittify.
 *
 * @author  Mike Garde
 *
 * @param array    $array      Array you want to see.
 * @param boolean  $die        Should this kill the process when done?
 * @param boolean  $return     Do you want this echoed or returned
 *
 * @return string A view of an array but formatted for easy reading via HTML.
 */
function print_a($array=false, $die=true, $return=false) {

	if($return) {
		echo 'running print_a with return';
		print_r($array);
		die();
	}


	if(!$array) {
		$array = $GLOBALS;
	}

	$result = ((is_array($array)) ? 'Array' : 'stdClass Object') . " (\n";
	foreach($array as $key => $value) {

		//$result.= '    ['.((preg_match("/^[0-9]+$/", $key)) ? $key : '\''.$key.'\'').'] => ';
		$result.= '    ['. $key .'] => ';

		if(is_array($value) || is_object($value))
			$result.= print_a($value, false, true);
		elseif(strlen($value) == 0)
			$result.= 'null';
		elseif(preg_match("/^[0-9]+$/", $value))
			$result.= $value;
		elseif(preg_match("/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/", $value))
			$result.= '<span title="'.date("D, M j, Y, g:i a", strtotime($value)).' | '.clean_time_diff($value).'">'.$value.'</span>';
		else {
			$value = addcslashes(htmlspecialchars($value), '\'');

			if(strlen($value) > 240) {
				$value = str_replace(array("\n", "\r"), array('<br />', ''), $value);
				$result.= '<details><summary>\''.substr($value, 0, 80).'\'</summary>\''.$value.'\'</details>';
			} else {
				$result.= '\''.$value.'\'';
			}
		}
		$result.= "\n";
	}
	$result.= ')';
	$result = str_replace(array('    ', "\t"), '&nbsp;&nbsp;&nbsp;&nbsp;', $result);

	echo 'Done Running foreach'."\n";

	/*
	//$array = object_to_array($array);
	$array = htmlspecialchars(print_r($array, true));
	$array = preg_replace('/\[(.*[a-zA-Z]{1}.*)\] =&gt; /i', '[\'$1\'] => ', $array);
	$array = preg_replace_callback('/ =&gt; ([^0-9^\n]{1}.*)(\n[[\s]{4}\[|\)])/i', "addslashes_2_regex", $array);
	$array = preg_replace('/ => \'(Array|stdClass Object)\'/i', " => $1", $array);
	//$array = htmlspecialchars($array);
	*/

	if(!$return) {
		$string = '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.js"></script>';
		$string.= '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/lang-css.js"></script>';
		$string.= '<link rel="stylesheet" type="text/css" href="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.css">';
		$string.= '<link href="//fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet" type="text/css">';
		$string.= '<style>';
		$string.= 'pre { background-color: #fff; font-family: \'Ubuntu Mono\', sans-serif; }';
		$string.= 'li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal; }';
		$string.= 'ol { padding: 0 0 0 45px; }';
		$string.= 'details { display: inline-block; }';
		$string.= '</style>';
		$string.= '<pre class="prettyprint linenums">'. $result .'</pre>';
		$string.= '<script>prettyPrint();</script>';
		echo $string;

		if ($die)
			die();
	} else {
		return $string;
	}

}


/**
 * Called by preg_replace_callback
 *
 * @param array  $matches
 */
function addslashes_2_regex($matches){
	return ' => \''.addslashes($matches[1])."'\n";
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


/**
 * Returns an easly readable time difference.
 *
 * @author  Mike Garde
 *
 * @param string  $start  Start time OR previously calculated difference
 * @param string  $end    End time OR leave blank if using previously calculated difference
 *
 * @return string Clean and readable difference in time
 */
function clean_time_diff($start, $end=false){
	return 'x days ago';
}