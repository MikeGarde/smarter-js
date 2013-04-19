function isInt(testThis) {
	var intRegex = /^\d+$/;
	if(intRegex.test(testThis)) {
		return true;
	} else {
		return false;
	}
}