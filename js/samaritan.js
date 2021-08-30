var samaritanModule = (function () {

	_$State = {
		isText: false,
		wordTime: 750, // Time to display a word
		wordAnim: 150, // Time to animate a word
		randomInterval: 18000,
		lastRandomIndex: -1,
		randomTimer: null,
		lastMouseUp: -1
	};

	// From Stack Overflow
	// http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
	$.fn.textWidth = function () {
		var html_org = $(this).html();
		var html_calc = '<span>' + html_org + '</span>';
		$(this).html(html_calc);
		var width = $(this).find('span:first').width();
		$(this).html(html_org);
		return width;
	};

	// http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
	var _getUrlParameter = function(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}

	var _processMessageFromHash = function() {
		var message = decodeURIComponent(window.location.hash.slice(1));
		if (message) {
			setTimeout(function () {
				write(message);
			}, _$State.wordTime);
		}
	}

	var _blinkTriangle = function () {
		// Stop blinking if samaritan is in action
		if (_$State.isText)
			return;
		_$State.triangle.fadeTo(500, 0).fadeTo(500, 1, _blinkTriangle);
	}

	var _runRandomPhrase = function () {
		// Get a random phrase and makes samaritan write
		var randomIndex = 0;
		if (_$State.phraselist.length > 1) {
			if (_getUrlParameter('random') == 'false') { //if random parameter is set to false
				if (_$State.lastRandomIndex + 1 != _$State.phraselist.length) { //if it's not the last one
					randomIndex = _$State.lastRandomIndex + 1;
				}
			} else {
				randomIndex = Math.floor(Math.random() * (_$State.phraselist.length - 0));
				while (randomIndex == _$State.lastRandomIndex)
					randomIndex = Math.floor(Math.random() * (_$State.phraselist.length - 0));
			}
		}
		_$State.lastRandomIndex = randomIndex;
		write(_$State.phraselist[randomIndex]);
	}

	var _randomTimePhrase = function () {
		if (_$State.randomTimer !== null)
			clearTimeout(_$State.randomTimer);
		var randomTime = Math.floor(Math.random() * (3000 - 0));
		randomTime += _$State.randomInterval;
		_$State.randomTimer = setTimeout(_runRandomPhrase, randomTime);
	}

	//PUBLIC *******************************

	var start = function () {
		//$('#interface').hide();
		//setTimeout(function () {
		//	$('#boot-screen').fadeOut(2400);
		//	$('#interface').fadeIn(2400);
		//}, 7000);
		//$('#interface').fadeIn(2400);

		// Cache the jquery things
		_$State.triangle = $('#triangle');
		_$State.text = $('#main p');
		_$State.line = $('#main hr');

		// Start the triangle blinking
		_blinkTriangle();

		// Store the phrase list in the state
		if (_$State.phraselist !== undefined)
			phraselist = phraselist.concat(_$State.phraselist);
		_$State.phraselist = phraselist;
		
		_randomTimePhrase();
		
		$(document).bind("mouseup", function () {
			if ((Date.now() - _$State.lastMouseUp) <= 500) {
				//console.log("DblClick");
				if (screenfull.enabled) {
					screenfull.toggle();
				}
			}
			_$State.lastMouseUp = Date.now();
		}).bind("click", _runRandomPhrase);

		// And do a timed random phrase
		_randomTimePhrase();
	}; //end start function

	var write = function (phrase) {
		if (_$State.isText)
			return;

		_$State.isText = true
		var phraseArray = phrase.split(" ");
		// First, finish() the blink animation and
		// scale down the marker triangle
		_$State.triangle.finish().animate({
			'font-size': '0em',
			'opacity': '1'
		}, {
			'duration': _$State.wordAnim,
			// Once animation triangle scale down is complete...
			'done': function () {
				var timeStart = 0;
				// Create timers for each word
				phraseArray.forEach(function (word, i) {
					var wordTime = _$State.wordTime;
					if (word.length > 8)
						wordTime *= (word.length / 8);
					setTimeout(function () {
						// Set the text to black, and put in the word
						// so that the length can be measured
						_$State.text.addClass('hidden').html(word);
						// Then animate the line with extra padding
						_$State.line.animate({
							'width': (_$State.text.textWidth() + 18) + "px"
						}, {
							'duration': _$State.wordAnim,
							// When line starts anmating, set text to white again
							'start': _$State.text.removeClass('hidden')
						})
					}, (timeStart + _$State.wordAnim));
					timeStart += wordTime;
				});

				// Set a final timer to hide text and show triangle
				setTimeout(function () {
					// Clear the text
					_$State.text.html("");
					// Animate trinagle back in
					_$State.triangle.finish().animate({
						'font-size': '2em',
						'opacity': '1'
					}, {
						'duration': _$State.wordAnim,
						// Once complete, blink the triangle again and animate the line to original size
						'done': function () {
							_$State.isText = false;
							_randomTimePhrase();

							_blinkTriangle();
							_$State.line.animate({
								'width': "30px"
							}, {
								'duration': _$State.wordAnim,
								'start': _$State.text.removeClass('hidden')
							})
						}
					});
				}, timeStart + _$State.wordTime);
			}
		})
	}; // write function

	var showImages = function (imagesURL) {
		var baseSpeed = 8770;
		var scrollBarInterval = 3000;
		var imageInterval = 1337;

		var leftRatio = Math.random() / 2 + 1.3;

		setTimeout(function(){
			var intervalLeftImages = setInterval(function(){
				if(imagesURL.length == 0){
					clearInterval(intervalLeftScroll);
					return;
				}

				//style bugs on chrome on fixed images
				var image = $('<img width="250" src="' + imagesURL.pop() + '">');
				$('body').append(image);
				image.attr('style', 'position: fixed; left: 20vw; top: 2000px; z-index: -1;');
				image.velocity({
					top: '-2000px'
				}, baseSpeed * leftRatio, 'linear', function(){
					image.remove();
				});


			}, imageInterval * leftRatio);
		}, scrollBarInterval);

		var intervalLeftScroll = setInterval(function(){
			if(imagesURL.length == 0){
				clearInterval(intervalLeftScroll);
				return;
			}

			var scrollbar = $('<img src="img/scrollbar.png">');
			$('body').append(scrollbar);
			scrollbar.attr('style', 'position: fixed; left: 10vw; top: 2000px; z-index: -1;');
			scrollbar.velocity({
				top: '-2000px'
			}, baseSpeed * leftRatio, 'linear', function(){
				scrollbar.remove();
			});
		}, scrollBarInterval * leftRatio);

		var rightRatio = Math.random() / 2 + 1.3;

		setTimeout(function(){
			var intervalRightImages = setInterval(function(){
				if(imagesURL.length == 0){
					clearInterval(intervalLeftScroll);
					return;
				}

				//style bugs on chrome on fixed images
				var image = $('<img width="250" src="' + imagesURL.pop() + '">');
				$('body').append(image);
				image.attr('style', 'position: fixed; right: 20vw; top: 2000px; z-index: -1;');
				image.velocity({
					top: '-2000px'
				}, baseSpeed * rightRatio, 'linear', function(){
					image.remove();
				});


			}, imageInterval * rightRatio);
		}, scrollBarInterval);

		var intervalRightScroll = setInterval(function(){
			if(imagesURL.length == 0){
				clearInterval(intervalLeftScroll);
				return;
			}

			var scrollbar = $('<img src="img/scrollbar.png">');
			$('body').append(scrollbar);
			scrollbar.attr('style', 'position: fixed; right: 10vw; top: 2000px; z-index: -1; transform: scaleX(-1); filter: FlipH;');
			scrollbar.velocity({
				top: '-2000px'
			}, baseSpeed * rightRatio, 'linear', function(){
				scrollbar.remove();
			});
		}, scrollBarInterval * rightRatio);


	}

	var writeFromUrl = function () {
		var urlMsg = _getUrlParameter('msg');
		if (urlMsg !== undefined) {
			urlMsg = urlMsg.split('%20').join(' ').split('%22').join('').split('%27').join("'");
			write(urlMsg);
		} else {
			_processMessageFromHash();
		}

		// Show a new message whenever the URL fragment changes
		$(window).on('hashchange', _processMessageFromHash);
	}

	return {
		start: start,
		write: write,
		showImages: showImages,
		writeFromUrl: writeFromUrl
	};

})();
