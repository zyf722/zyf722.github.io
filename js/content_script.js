function respondToQRMessage (res) {
	
	if(res.summaryBox != undefined) {
		$("<div>W|A has something for you!</div>").prependTo("body").hide().slideDown("slow");
	}
}


// this feature is not ready, so don't send message
//chrome.extension.sendMessage({"action" : "queryQR"});
chrome.extension.onMessage.addListener(function (res, _, sendResponse) {
	respondToQRMessage(res);
});