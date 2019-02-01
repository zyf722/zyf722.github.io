// allows us to redirect to the install page


if(!localStorage["returnUser"]){

	// set default options

	localStorage["open_in"] = "newtab";
	localStorage["showTips"] = "true";
	localStorage["returnUser"] = "true";

}

/* 
	function selectionOnClick
	- sends selected text to Wolfram|Alpha
 */

function selectionOnClick(info, tab) {
	sendTextToWA(info.selectionText);
}

/* 
	function imageOnClick
	- sends image to Wolfram|Alpha
 */

function imageOnClick(info, tab) {
	sendFileToWA(info.srcUrl);
}

/* 
	function fileOnClick
	- sends file to Wolfram|Alpha
 */

function fileOnClick(info, tab) {
	sendFileToWA(info.linkUrl);
}

/* 
	function sendFileToWA
	- opens a tab underneath to W|A using the supplied file (including images)
	- used by file context menu and image context menu
 */

function sendFileToWA(link) {
	/*
	var input = encodeURI(link);	
	chrome.tabs.create({"url" : "http://www.wolframalpha.com/input/?i=+&lk=3&fileinput=" + input, "active" : sameTab});
	*/

	//TODO: Implement file stuff as Mahae and Eric explained (requires design/UX for login etc)
}

/* 
	function sendTextToWA
	- opens a tab underneath to W|A using the supplied input
	- used by selection context menu
 */

function sendTextToWA(inString) {

	var input = encodeURIComponent(inString)+"&t=crmtb01&f=rc";
	optionedWA(input);

}

// helper function to deal with the "open in" option

function optionedWA(input) {
	
	if(localStorage["open_in"] == "sametab") {	
		chrome.tabs.getSelected( undefined, function(tab) {
			chrome.tabs.update(tab.id, {url: "http://www.wolframalpha.com/input/?i="+input}, undefined);
		}); 
	} else {
		chrome.tabs.create({"url" : "http://www.wolframalpha.com/input/?i=" + input, "active" : true});
	}
	
}


function inputChangedWA(inString, suggest) {
	/*if (typeof jQuery == 'undefined') {
	
	    alert("jQuery library is not found!");
	    return;
	 
	}*/

	if(inString=="") {
		return;
	}
	
	var input = encodeURIComponent(inString);
	var autoUrl =  "http://www.wolframalpha.com/input/autocomplete.jsp?qr=0&i=" + input + "&t=crmtb01";

	$.ajax(autoUrl, {
		"dataType" : "json",
		"success" : function (jsonData) {
		
			//turn into SuggestResult array
			var resultsFromJson = jsonData.results;
			if(resultsFromJson.length == 0) {return;} // if we have no suggestions
			var suggestFromJson = []; //array of SuggestResult objects
			var len = Math.min(5, resultsFromJson.length); // max 5 suggestions
			for (i = 0; i < len; i++) {

				var descripString = resultsFromJson[i].input;
				/*if(!resultsFromJson[i].description) { // if a description is not available

					descripString = "Ask Wolfram|Alpha"; // use something generic

				} else {
					descripString = resultsFromJson[i].description;
				}

				descripString = resultsFromJson[i].input + " -- " + descripString;*/

				suggestFromJson.push({
					"content" : resultsFromJson[i].input, 
					"description" : descripString
				});
			}
			
			suggest(suggestFromJson);
		}
	});
			//}
		//}
	//});
}

/* 
	function omniWA
	- naviagates current tab to W|A
	- used by omnibox
 */

function omniWA(inString) {
	if(inString=="") {
		if(localStorage["open_in"] == "sametab") {
			chrome.tabs.getSelected( undefined, function(tab) {
				chrome.tabs.update(tab.id, {url: "http://www.wolframalpha.com/"}, undefined);
				window.close();	
			}); 
		} else {
			chrome.tabs.create({"url" : "http://www.wolframalpha.com/", "active" : true});
		}
	} else {
		var input = encodeURIComponent(inString);	
		chrome.tabs.getSelected( undefined, function(tab) {
			chrome.tabs.update(tab.id, {url: "http://www.wolframalpha.com/input/?t=crmtb01&f=ob&i="+input}, undefined);
		}); 
	}
}

// the (non-image) files supported by W|A
var filePatterns = ["http://*.com/*.pdf", "http://*.com/*.doc*"];

// right click context menu
chrome.contextMenus.create({
	"title" : "Compute '%s' with Wolfram|Alpha", 
	"contexts" : ["selection"], 
	"onclick" : selectionOnClick
}); 
/*chrome.contextMenus.create({
	"title" : "Analyze Image with Wolfram|Alpha", 
	"contexts" : ["image"], 
	"onclick" : imageOnClick
}); 
chrome.contextMenus.create({
	"title" : "Analyze File with Wolfram|Alpha", 
	"contexts" : ["link"],
	"documentUrlPatterns" : filePatterns, 
	"onclick" : fileOnClick
});*/

//"omnibox" (reacting to users entering "=" in the URL input box)
chrome.omnibox.onInputEntered.addListener(omniWA);
chrome.omnibox.setDefaultSuggestion({"description" : "Compute '%s' with Wolfram|Alpha"});
chrome.omnibox.onInputChanged.addListener(inputChangedWA);


// suppporting the stripe

function sendStripeResponse(res, id) {
	chrome.tabs.sendMessage(id, res);
}

function historyRedirect(tab) {

	var patt = "[?&]q=([^&#]*)",
	regex = new RegExp(patt),
	results = regex.exec(tab.url);
	// already encoded
	
	if(results != null) {
		chrome.tabs.update({"url" : "http://www.wolframalpha.com/input/?i=" + results, "active" : sameTab});
	}


}
