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
 * @return string  $string  A view of an array but formatted for easy reading via HTML.
 */
function print_a($array=false, $die=true, $return=false) {

	if(!$return)
		$return = 0;

	if(!$array && !$return)
		$array = $GLOBALS;

	if(!$return) {
		$in = '';
		$dent = '    ';
	} elseif($return) {
		$in = str_repeat(' ', ($return*4));
		$dent = str_repeat(' ', ($return*4)+4);
	}
	$indent = $in.$dent;
	unset($dent);

	$result = ($return) ? ' ' : $in;
	$result.= ((is_array($array)) ? 'Array' : 'stdClass Object')." (\n";
	foreach($array as $key => $value) {

		$result.= $indent.'['. $key .'] => ';

		if(is_array($value) || is_object($value))
			$result.= print_a($value, false, $return+1);
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
	$result.= $in.')';
	$result = str_replace(array('    ', "\t"), '&nbsp;&nbsp;&nbsp;&nbsp;', $result);

	if(!$return) {
		$string = '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.js"></script>'.
				  '<script src="//google-code-prettify.googlecode.com/svn/trunk/src/lang-css.js"></script>'.
				  '<link rel="stylesheet" type="text/css" href="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.css">'.
				  '<link href="//fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet" type="text/css">'.
				  '<style>'.
				  'pre { background-color: #fff; font-family: \'Ubuntu Mono\', sans-serif; }'.
				  'li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal; }'.
				  'ol { padding: 0 0 0 45px; }'.
				  'details, details summary { display: inline-block; }'.
				  'details[open] summary span { display: none; }'.
				  '</style>'.
				  '<pre class="prettyprint linenums">'. $result .'</pre>'.
				  '<script>prettyPrint();</script>';
		echo $string;

		if ($die) die();

	} else {
		return $result;
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
 *
 *
 * @example echo clean_time_diff(strtotime('-8 hours -31 minutes'));
 * @example echo clean_time_diff('2013-05-03 10:15:41');
 * @example echo clean_time_diff('2015-01-01 00:00:00', '2013-05-03 10:15:41');
 */
function clean_time_diff($start, $end=false){

	if(!is_int($start)) $start = strtotime($start);
	if(!is_int($end)) $end = strtotime($end);

	$diff   = (($end == false) ? time() : $end) - $start;
	$tense  = ($diff > 0) ? 'ago' : 'in the future';
	$diff   = abs($diff);
	$return = '';

	// Now
	if($diff == 0)
		return 'now';

	// Seconds
	if($diff < 60) {
		$return = $diff.' second'. (($diff==1) ? '' : 's');

	// Minutes
	} elseif($diff < 3600) {
		$minutes = round($diff / 60);
		$return = $minutes .' minute'. (($minutes==1) ? '' : 's');

	// < 4 Hours
	} elseif($diff < 14400) {
		$hours = floor($diff / 3600);
		$minutes = round((($diff / 3600) - $hours) * 60);
		$append = ($minutes > 0) ? ', '.$minutes.' minute'.(($hours==1) ? '' : 's') : '';
		$return = $hours.' hour'.(($hours==1) ? '' : 's').$append;

	// Hours
	} elseif($diff < 86400) {
		$hours = round($diff / 3600);
		$return = $hours .' hours';

	// < 4 Days
	} elseif($diff < 345600) {
		$days = floor($diff / 86400);
		$hours = round((($diff / 86400) - $days) * 24);
		$append = ($hours > 0) ? ', '.$hours.' hour'.(($hours==1) ? '' : 's') : '';
		$return = $days.' day'.(($days==1) ? '' : 's').$append;

	// Days
	} elseif($diff < 2592000) {
		$days = round($diff / 86400);
		$return = $days.' day'.(($days==1) ? '' : 's');

	// < 4 Months
	} elseif($diff < 10511769) {
		$months = floor($diff / 2627942);
		$days = round((($diff / 2627942) - $months) * 30.416);
		$append = ($days > 0) ? ', '.$days.' day'.(($days==1) ? '' : 's') : '';
		$return = $months.' month'.(($months==1) ? '' : 's').$append;

	// Months
	} elseif($diff < 31536000) {
		$months = round($diff / 2627942);
		$return = $months.' month'. (($months==1) ? '' : 's');

	// Years
	} else {
		$years = floor($diff / 31536000);
		$months = round((($diff / 31536000) - $years) * 12);
		$append = ($months > 0) ? ', '.$months.' month'.(($months==1) ? '' : 's') : '';
		$return = $years.' year'.(($years==1) ? '' : 's').$append;

	}
	return $return.' '.$tense;
}