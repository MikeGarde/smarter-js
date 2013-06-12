// Check if a number is an Integer
function isInt(testThis) {
	var intRegex = /^\d+$/;
	if(intRegex.test(testThis)) {
		return true;
	} else {
		return false;
	}
}

// The indexOf() method returns the position of the first occurrence of a specified value in a string.
// This method returns -1 if the value to search for never occurs.
// See: http://www.w3schools.com/jsref/jsref_indexof.asp
// But some browsers don't support this, so we're adding it
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;

		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	}
}