'use strict';

if (window.location.pathname !== '/') {
	if (document.getElementById('head').innerHTML.length > 12) {
		document.getElementById('head').className += "shrink";
	}
}

document.getElementById('search').addEventListener('click', function(e) {
	e.preventDefault();
	console.log(document.getElementById('userName').innerText);
	if (document.getElementById('userName').value.length === 0) {
		document.getElementById('userName').className = "warn";
	} else {
		this.parentNode.submit();
		document.getElementById('userName').className = '';
	}
});
