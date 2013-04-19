<?php

include('debug.php');

class color {
	public $hexA = '';
	public $hexB = '';
	public $decA = array('R'=>null, 'G'=>null, 'B'=>null);
	public $decB = array('R'=>null, 'G'=>null, 'B'=>null);

	public $hueA = null;
	public $hueB = null;

	public $cold	= null;
	public $bright	= null;
	public $lum		= null;
	public $hue		= null;
	public $sat		= null;
	
	/**
	 * Convert Hex Color to RGB
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 * @param string $hex Hex Color
	 *
	 * @return Dec (RGB) Color of a Hex Color
	 */
	public function hex2dec($hex) {
		$hex = STR_REPLACE('#', '', $hex);
		if(strlen($hex) == 3)
			$hex = $hex.$hex;

		$ret = array(
				'R' => HEXDEC(SUBSTR($hex, 0, 2)),
				'G' => HEXDEC(SUBSTR($hex, 2, 2)),
				'B' => HEXDEC(SUBSTR($hex, 4, 2)) );
		
		$H = 0;
		$S = 0;

		$min = min($ret['R'],$ret['G'],$ret['B']);
		$max = max($ret['R'],$ret['G'],$ret['B']);
		$delta = ($max - $min);

		$L = ($max + $min) / 5.1;

		if($delta != 0) {
			
			$S = $delta / (($L > 50) ? (510 - $max - $min) : ($max + $min));

			if ($max == $ret['R']) {
				$H = ($ret['G'] - $ret['B']) / (6.0 * $delta);
			} elseif ($max == $ret['G']) {
				$H = (1/3) + ($ret['B'] - $ret['R']) / (6.0 * $delta);
			} else {
				$H = (2/3) + ($ret['R'] - $ret['G']) / (6.0 * $delta);
			}

			if ($H < 0)
				$H += 1;
			if ($H > 1)
				$H -= 1;
		}
		
		$ret['H'] = round($H*360, 0);
		$ret['S'] = round($S*100, 0);
		$ret['L'] = round($L, 0);

		return $ret;
	}

	/**
	 * Calculate Hue
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 * @param string $dec Dec Color
	 *
	 * @return Color Hue
	 */
	public function calc_hue($dec) {
		return 180/pi() * atan2( sqrt(3)*($dec['G']-$dec['B']) , ( (2*$dec['R'])-$dec['G']-$dec['B'] ) );
	}

	/**
	 * Difference of Hue
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 *
	 * @return Hue Difference
	 */
	public function hue_diff() {
		return ($this->decB['H'] - $this->decA['H']);
	}

	/**
	 * Difference in Coolness (don't worry, this isn't high school)
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 * @param boolean $p Return Percentage
	 *
	 * @return Coolness Difference
	 */
	public function cold_diff($p=true) {
		$r = max($this->decA['R'],$this->decB['R']) - min($this->decA['R'],$this->decB['R']);
		$g = max($this->decA['G'],$this->decB['G']) - min($this->decA['G'],$this->decB['G']);
		$b = max($this->decA['B'],$this->decB['B']) - min($this->decA['B'],$this->decB['B']);

		$return = $r + $g + $b;
		return ($p) ? ($return / 765) : $return;
	}

	/**
	 * Difference in Brightness
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 * @param boolean $p Return Percentage
	 *
	 * @return Brightness Difference
	 */
	public function bright_diff($p=true){
		
		$rA = 299 * $this->decA['R'];
		$gA = 587 * $this->decA['G'];
		$bA = 114 * $this->decA['B'];
		
		$rB = 299 * $this->decB['R'];
		$gB = 587 * $this->decB['G'];
		$bB = 114 * $this->decB['B'];

		$A = ($rA + $gA + $bA) / 1000;
		$B = ($rB + $gB + $bB) / 1000;

		$return = $A-$B;
		return ($p) ? ($return / 255) * 100 : $return;
	}

	/**
	 * Difference in Luminosity
	 *
	 * @author Mike Garde
	 *
	 * @access public
	 *
	 * @return Luminosity Difference
	 */
	public function lum_diff(){
		return ($this->decB['L'] / $this->decA['L']);
	}

	/**
	 * The Pythagorean Theory of Music and Color
	 *
	 * @author  Mike Garde
	 *
	 * @access public
	 * @param boolean $p Return Percentage
	 *
	 * @return The Pythagorean difference between two colors
	 */
	public function pyth_diff($p=true){
		$R = $this->decA['R'] - $this->decB['R'];
		$G = $this->decA['G'] - $this->decB['G'];
		$B = $this->decA['B'] - $this->decB['B'];

		$return = sqrt( ($R * $R) + ($G * $G) + ($B * $B) );
		return ($p) ? ($return / sqrt(195075)) * 100 : $return;
	}

	/**
	 * Difference in Saturation
	 *
	 * @author  Mike Garde
	 *
	 * @access public
	 *
	 * @return Saturation Difference
	 */
	function sat_diff() {
		
		return ($this->decB['S'] / $this->decA['S']);
	}
}
$color = new color;


function return_json($array) {
	header('Pragma: no-cache');
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Tue, 25 April 1989 05:00:00 GMT');
	header('Content-type: application/json');
	echo json_encode($array);
	die();
}


if(!empty($_GET)){
	
	$color->hexA = $_GET['color_a'];
	$color->hexB = $_GET['color_b'];

	$color->decA = $color->hex2dec($color->hexA);
	$color->decB = $color->hex2dec($color->hexB);

	$color->hueA = $color->calc_hue($color->decA);
	$color->hueB = $color->calc_hue($color->decB);

	$color->cold	= $color->cold_diff();
	$color->bright	= $color->bright_diff();
	$color->lum		= $color->lum_diff();
	$color->hue		= $color->hue_diff();
	$color->sat		= $color->sat_diff();

	$nl = "\n";
	$colorA = '#'.$color->hexA;

	$colorB = '@colorA';
	if($color->hue != 0) {
		$colorB = 'spin('. $colorB .', '. $color->hue .')';
	}
	if($color->sat != 1) {
		$colorB = (($color->sat > 0) ? 'saturate(' : 'desaturate('). $colorB .', ';
		$colorB.= abs($color->sat) .')';
	}
	if($color->lum != 1) {
		$colorB = (($color->lum < 0) ? 'lighten(' : 'darken('). $colorB .', ';
		$colorB.= abs($color->lum) .'%)';
	}

	$css = '@colorA: '.$colorA.';
@colorB: '.$colorB.';
 
.css-classA {
	background-color: @colorA;
}
.css-classB {
	background-color: @colorB;
}';

	$json = array(	'target'	=> array(	'css' => $css,
											'less'=> $css,
											'extra' => 'cold: '. $color->cold_diff() ."/n bright: ". $color->bright_diff() ."/n lum: ". $color->lum_diff() ."/n pyth: ". $color->pyth_diff() ."/n hue: ". $color->hue),

					'script'	=> array('../js/content-listener.js'),
					//'function'	=> 'less.refresh(true)',
					'lum'		=> $color->lum,
					'hue'		=> $color->hue,
					'sat'		=> $color->sat,
					'ColorA'		=> $color->decA,
					'ColorB'		=> $color->decB,
					'GET'		=> $_GET
				);
	return_json($json);

}

?>
<!DOCTYPE html>
<html>
<head>
	<title>CSS LESS Color Function Finder</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js" type="text/javascript"></script>
	<script src="../js/debug.js" type="text/javascript"></script>
	<script type="text/javascript">
		include_google_pretty();
	</script>

	<!--
	<link rel="stylesheet" type="text/css" href="../css/site.css" />
	<link rel="stylesheet" type="text/css" href="../css/debug.css" />
	-->

	<link href='http://fonts.googleapis.com/css?family=Ubuntu+Mono|Molle:400italic|Roboto:400,300' rel='stylesheet' type='text/css' />

	<script type="text/javascript" src="../js/content-initiate.js"></script>

	<!--[if lt IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

</head>
<body>
<div class="ajax_targetable wrapper">
	<h1>CSS LESS Color Function Finder</h1>

	<form class="ajax" action="color.php">
		<input type="text" name="color_a" placeholder="Color A" value='e93d1b' />
		<input type="text" name="color_b" placeholder="Color B" value='79a975' />
		<input type="submit" value="Go" />
	</form>

	<pre class="prettyprint linenums lang-css" data-target="css">
@colorA: #cccccc;
@colorB: lighten(@colorA, 10%);

.css-classA {
	color: @colorA;
}
.css-classB {
	color: @colorB;
}
	</pre>

	<style type='text/less' data-target="less">
		@colorA: #cccccc;
		@colorB: lighten(@colorA, 10%);

		.css-classA {
			background-color: @colorA;
		}
		.css-classB {
			background-color: @colorB;
		}
	</style>

	<div class='css-classA'></div>
	<div class='css-classB'></div>

	<div class="color_group primary">
		<div class='tl'></div>
		<div class='bl'></div>
		<div class='tr'></div>
		<div class='br'></div>
		<div class='main'></div>
	</div>
	<div class="color_group complementary">
		<div class='tl'></div>
		<div class='bl'></div>
		<div class='tr'></div>
		<div class='br'></div>
		<div class='main'></div>
	</div>
	<div class="color_group secondaryA">
		<div class='tl'></div>
		<div class='bl'></div>
		<div class='tr'></div>
		<div class='br'></div>
		<div class='main'></div>
	</div>
	<div class="color_group secondaryB">
		<div class='tl'></div>
		<div class='bl'></div>
		<div class='tr'></div>
		<div class='br'></div>
		<div class='main'></div>
	</div>

	<pre class="prettyprint linenums lang-json" data-target="dump">I'm the AJAX Dump</pre>
</div>

	
<link rel="stylesheet/less" type="text/css" href="../css/_style.less" />
<script type="text/javascript" src="../js/less.js"></script>
<script type="text/javascript">
	//less.env = "development";
	//less.watch();
</script>
</body>
</html>
