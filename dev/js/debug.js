// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

function dump_each(data, result, tab) {

	if(tab === undefined) var tab = '';
	if(result === undefined) var result = tab +'{\n';

	tab += '\t';

	$.each(data, function(index, value) {
		result += tab;
		result += (index === undefined) ? '' : '"'+ index +'": ';
		result += (value instanceof Object) ? dump_each(value, result, tab) : '"'+ value +'"\n';
	});

	result += '}\n';

	return result;
}

/* repeatString() returns a string which has been repeated a set number of times */
function repeatString(str, num) {
	out = '';
	for (var i = 0; i < num; i++) {
		out += str;
	}
	return out;
}

/*
dump() displays the contents of a variable like var_dump() does in PHP. dump() is
better than typeof, because it can distinguish between array, null and object.
Parameters:
v:              The variable
howDisplay:     "none", "body", "alert" (default)
recursionLevel: Number of times the function has recursed when entering nested
				objects or arrays. Each level of recursion adds extra space to the
				output to indicate level. Set to 0 by default.
Return Value:
A string of the variable's contents
Limitations:
Can't pass an undefined variable to dump().
dump() can't distinguish between int and float.
dump() can't tell the original variable type of a member variable of an object.
These limitations can't be fixed because these are *features* of JS. However, dump()
*/
function dump(v, howDisplay, recursionLevel) {
	howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
	recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


	var vType = typeof v;
	var out = vType;

	switch (vType) {
		case "number":
			/* there is absolutely no way in JS to distinguish 2 from 2.0
			so 'number' is the best that you can do. The following doesn't work:
			var er = /^[0-9]+$/;
			if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
				out = 'int';*/
		case "boolean":
			out += ": " + v;
			break;
		case "string":
			out += "(" + v.length + '): "' + v + '"';
			break;
		case "object":
			//check if null
			if (v === null) {
				out = "null";

			}
			//If using jQuery: if ($.isArray(v))
			//If using IE: if (isArray(v))
			//this should work for all browsers according to the ECMAScript standard:
			else if (Object.prototype.toString.call(v) === '[object Array]') {
				out = 'array(' + v.length + '): {\n';
				for (var i = 0; i < v.length; i++) {
					out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
						dump(v[i], "none", recursionLevel + 1) + "\n";
				}
				out += repeatString('   ', recursionLevel) + "}";
			}
			else { //if object
				sContents = "{\n";
				cnt = 0;
				for (var member in v) {
					//No way to know the original data type of member, since JS
					//always converts it to a string and no other way to parse objects.
					sContents += repeatString('   ', recursionLevel) + "   " + member +
						":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
					cnt++;
				}
				sContents += repeatString('   ', recursionLevel) + "}";
				out += "(" + cnt + "): " + sContents;
			}
			break;
	}

	if (howDisplay == 'body') {
		var pre = document.createElement('pre');
		pre.innerHTML = out;
		document.body.appendChild(pre)
	}
	else if (howDisplay == 'alert') {
		alert(out);
	}

	return out;
}

function include_google_pretty() {
	document.write('<scr'+'ipt src="http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.js"></sc'+'ript>');
	document.write('<scr'+'ipt src=\"http://google-code-prettify.googlecode.com/svn/trunk/src/lang-css.js\"></sc'+'ript>');
	document.write('<link rel="stylesheet" type="text/css" href="http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.css">');
	document.write('<link href="http://fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet" type="text/css">');
	document.write('<style>pre, code { font-family: \'Ubuntu Mono\', sans-serif; } li.L0, li.L1, li.L2, li.L3, li.L5, li.L6, li.L7, li.L8 { list-style-type: decimal; }</style>');

	$(document).ready(function() {
		prettyPrint();
	});

}
