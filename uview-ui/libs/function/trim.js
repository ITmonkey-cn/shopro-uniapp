<<<<<<< HEAD
function trim(str, pos = 'both') {
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, "");
	} else if (pos == "left") {
		return str.replace(/^\s*/, '');
	} else if (pos == 'right') {
		return str.replace(/(\s*$)/g, "");
	} else if (pos == 'all') {
		return str.replace(/\s+/g, "");
	} else {
		return str;
	}
}

export default trim
=======
function trim(str, pos = 'both') {
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, "");
	} else if (pos == "left") {
		return str.replace(/^\s*/, '');
	} else if (pos == 'right') {
		return str.replace(/(\s*$)/g, "");
	} else if (pos == 'all') {
		return str.replace(/\s+/g, "");
	} else {
		return str;
	}
}

export default trim
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
