var inputDisplay = $('.input'),
	outputDisplay = $('.output'),
	inputHidden = $('.input-box'),
	outputDebounce = false;

var responses = [
	'AFFIRMATIVE',
	'NEGATIVE',
	'WARNING\nILLEGAL ACTIVITY DETECTED'
]

$(document).on('click keydown', function() {
	inputHidden.focus();
});

inputHidden.on('keyup',function(e, ev) {
	if(e.which == 13) {
		if(!outputDebounce) {
			outputDebounce = true;
	       	typeText(getResponse());
	       	clearInput();
		}
       return;
    }
	inputDisplay.text($('.input-box').val());
});

function typeText(text, typeSpeed) {
	typeSpeed = typeSpeed || 150;
	var textArray = text && text.split('');

	typeLetter(textArray, typeSpeed);

}

function typeLetter(stringArray, typeSpeed, index) {
	index = index || 0;
	var char;

	if(index < stringArray.length) {
		char = stringArray[index];
		if(char === '\n') {
			char = '<br/>';
		}
		outputDisplay.append(char);
		index = ++index;
		setTimeout(function() {
			typeLetter(stringArray, typeSpeed, index)
		}, typeSpeed);
	} else {
		setTimeout(function() {
			clearOutput();
		}, 2000);
	}
}

function clearOutput() {
	outputDisplay.addClass('vanish');
    setTimeout(function() {
    	outputDisplay.removeClass('vanish');
    	outputDisplay.html('');
    	outputDebounce = false;

    }, 1000)
}

function clearInput() {
	inputDisplay.addClass('vanish');
    setTimeout(function() {
    	inputDisplay.removeClass('vanish');
    	inputDisplay.text('');
    	inputHidden.val('');
    }, 3000);
}

function getResponse() {
	return responses[Math.floor(Math.random() * responses.length)];
}

