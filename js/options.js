// Saves tab option to localStorage.
function saveTabsOption() {
	console.log("saving tabs");
	var open = document.getElementsByName("open");
	var openVal = getRadioValue(open);
	localStorage["open_in"] = openVal;
}

// Saves tips option to localStorage
function saveTipsOption() {
	console.log("saving tips");
	var tips = document.getElementsByName("tips");
	var tipsVal = getRadioValue(tips);
	localStorage["showTips"] = tipsVal;
}

// Restores select box state to saved value from localStorage.
function restoreOptions() {

	console.log("restoring");

	var open_in = localStorage["open_in"];
	var showTips = localStorage["showTips"];

	var newtab = document.getElementById("new");
	var sametab = document.getElementById("same");

	var show = document.getElementById("showRadio");
	var dontShow = document.getElementById("dontShowRadio");

	if (!open_in || open_in == "newtab") {
		newtab.checked = true;
	} else {
		sametab.checked = true;
	}

	if (!showTips || showTips == "true") {
		show.checked = true;
	} else {
		dontShow.checked = true;
	}
}

//Get a radio button input value
function getRadioValue(radioButtons) {
	for (var i=0; i < radioButtons.length; i++)
	{
		if(radioButtons[i].checked) {
			return radioButtons[i].value;
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	
	restoreOptions();

	document.getElementById("new").onclick = saveTabsOption;
	document.getElementById("same").onclick = saveTabsOption;

	document.getElementById("showRadio").onclick = saveTipsOption;
	document.getElementById("dontShowRadio").onclick = saveTipsOption;
	
});