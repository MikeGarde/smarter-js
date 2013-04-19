
var strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var strLowerCase = "abcdefghijklmnopqrstuvwxyz";
var strNumber	 = "0123456789";
var strCharacters= "!@#$%^&*?_~";

function password_strength(strPassword){

	//console.log(value);

	var depth = 0;

	var UpperCount = countContain(strPassword, strUpperCase);
	var LowerCount = countContain(strPassword, strLowerCase);
	var NumberCount = countContain(strPassword, strNumber);
	var CharacterCount = countContain(strPassword, strCharacters);

	if(UpperCount > 0)
		depth += 26;

	if(LowerCount > 0)
		depth += 26;

	if(NumberCount > 0)
		depth += 10;

	if(CharacterCount > 0)
		depth += 33;

	var size = Math.pow(depth, strPassword.length);
	var score = (size / 10000) / 60 / 60 / 24 / 7; // At 10,000 guesses per min, how many days.

	//console.log('score: '+score);
	score = roundNumber(score, 8);
	//console.log('round: '+score);

	var ln=Math.log;
	var multiplier = (strPassword.length < 8) ? 1.21 : 1.985;
	var score = (score < 0.0000001) ? 0.0000001 : score;

	score = 'ln('+ score +')';
	score = eval(score);
	//console.log(score);

	score = (score+16.119)*multiplier;
	//console.log(score);

	// Set new width
	var ddWidth = ( (score > 100) ? 100 : score ) + "%";
	var strText = '';
	var bgColor = '';

	if (score >= 80) {
		strText = 'Very Strong';
		bgColor = '3adb00';
	} else if (score >= 60) {
		strText = 'Strong';
		bgColor = 'aaeb39';
	} else if (score >= 40) {
		strText = 'You Can Do Better';
		bgColor = 'fbf932';
	} else if (score >= 20) {
		strText = 'Weak';
		bgColor = 'fbeba1';
	} else {
		strText = 'Shit\'s weak yo';
		bgColor = 'fa6262';
		score = strPassword.length;
	}

	if(strPassword.length == 0) {
		$('.password_warning.original').animate({opacity: 0}, 500, function(){});
	} else {
		var strText = '<p>Strength</p><dl><dt style="background-color: #'+ bgColor +'; width: '+ ddWidth +';"></dt><dd>'+ strText +'</dd></dl>';

		$('.password_warning.original').html(strText).css('display', 'inline-block');
		$('.password_warning.original').animate({opacity: 1}, 500, function(){});
	}

	//console.log('-------------------');

}

var password_delay = '';

function password_confirm(strPassword) {

	clearTimeout(password_delay);

	password_delay = setTimeout(function(){

		console.log(strPassword);

		if($('input.password_check[name="data[User][password]"]').val() == strPassword) {
			var match = true;
			strText = 'You\'ve Got It!';
			bgColor = '3adb00';
		} else {
			strText = 'mmmm, yea no';
			bgColor = 'fa6262';
			var match = false;
		}

		if(strPassword.length == 0) {
			$('.password_warning.confirm').animate({opacity: 0}, 500, function(){});
		} else {
			var strText = '<dl><dt style="background-color: #'+ bgColor +'; width: 100%;"></dt><dd>'+ strText +'</dd></dl>';

			$('.password_warning.confirm').html(strText).css('display', 'inline-block');
			$('.password_warning.confirm').animate({opacity: 1}, 500, function(){});
		}

	}, 900);

}



// Checks a string for a list of characters
function countContain(strPassword, strCheck) {
    // Declare variables
    var nCount = 0;

    for (i = 0; i < strPassword.length; i++) {
        if (strCheck.indexOf(strPassword.charAt(i)) > -1) {
                nCount++;
        }
    }
    return nCount;
}