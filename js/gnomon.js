'use strict';
(function($) {
	$.fn.gnomon = function(options) {
		var self = this,
			opts = $.extend({}, $.fn.gnomon.defaults, options);

		var commands = {
			invert: ['invert','goodnight']
		}

		var responses = {
			invert: function() {
				invert();
			},
			default: function() {
				typeText('This is the default');
			}
		}

		function build() {
			self.addClass('gnomon');

			buildInput();
			buildIcon();
			buildOutput();
			attachEventListeners();
		}

		function buildInput() {
			self.inputDisplay = $('<div/>').addClass('input').addClass('center').appendTo(self);
			self.inputHidden = $('<input/>').addClass('input-box').appendTo(self);
		}

		function buildIcon() {
			var iconWrapper = $('<div/>').addClass('icon-wrapper');

			self.icon = $('<div/>').html('<span class="fa fa-eye"></span>').addClass('icon').addClass('center').appendTo(iconWrapper);
			self.append(iconWrapper);
		}

		function buildOutput() {
			self.outputDisplay = $('<div/>').addClass('output').addClass('center').appendTo(self);
		}

		function attachEventListeners() {
			catchAllClicks();
			typeInInput();
		}

		function catchAllClicks() {
			$(document).on('click keydown', function() {
				self.inputHidden.focus();
			});			
		}

		function typeInInput() {
			self.inputHidden.on('keyup',function(e, ev) {
				if(e.which == 13) {
					submit();
			    	return;
			    }
			    updateInputDisplay();
			});
		}

		function updateInputDisplay() {
			self.inputDisplay.text($('.input-box').val());
		}

		function submit() {
			if(!self.outputDebounce) {
				self.outputDebounce = true;
				handleInput();
		       	clearInput();
			}
		}

		function handleInput() {
			var val = convertInputToCommand(self.inputHidden.val().toLowerCase()),
				response;

			if($.isFunction(responses[val])) {
				responses[val]();
			} else {
				responses['default']();
			}
		}

		function convertInputToCommand(input) {
			var command;

			$.each(commands, function(name, array) {
				if(array.includes(input)) {
					command = name;
					return;
				}
			});
			return command;
		}

		function invert() {
			$('body').toggleClass('invert');
			self.outputDebounce = false;
		}

		function defaultResponse() {
			typeText(getResponse());
		}

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
				self.outputDisplay.append(char);
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
			self.outputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.outputDisplay.removeClass('vanish');
		    	self.outputDisplay.html('');
		    	self.outputDebounce = false;

		    }, 1000)
		}

		function clearInput() {
			self.inputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.inputDisplay.removeClass('vanish');
		    	self.inputDisplay.text('');
		    	self.inputHidden.val('');
		    }, 4000);
		}

		build();
	}
	$.fn.gnomon.defaults = {
		afterBuild:function() {}
	};
}(jQuery))

