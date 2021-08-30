function compute() {

	var input = document.getElementById("input").value;
	window.open("http://www.wolframalpha.com/input/?i="+encodeURIComponent(input) + "&t=crmtb01","_blank");
}

function submitHandler(submitEvent) {
	compute();
}

$(document).ready(function () {

	$('#inputform').bind('submit', submitHandler);

});