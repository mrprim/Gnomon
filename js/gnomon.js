'use strict';
(function($) {
	$.fn.gnomon = function(options) {
		var self = this,
			opts = $.extend({}, $.fn.gnomon.defaults, options);

		var rituals = {
			minor: [],
			significant: [],
			major: []
		}

		var commands = {
			invert: {
				input: ['invert','goodnight'],
				action: invert
			},
			greet: {
				input: ['hi','hello','gnomon'],
				response: ['Hello, User','Yes?','How can I assist you?']
			},
			goodbye: {
				input: ['goodbye'],
				action: winkOutIcon,
				response: ['goodbye']
			},
			credits: {
				input: ['who?'],
				action: showCredits
			},
			ritual: {
				input: ['ritual'],
				response: ['MAAAAAGIC!']
			},
			error: {
				input: ['error'],
				action: glitch,
				response: ['error']
			},
			default: {
				response: ['...']
			}
		}

		function randomItem(array) {
			return array[Math.floor(Math.random()*array.length)];
		}

		function showCredits() {
			self.credits.addClass('reveal');
			setTimeout(function() {
				self.credits.removeClass('reveal');
			}, 5000)
		}

		function glitch() {
			self.icon.addClass('glitch');
			setTimeout(function() {
				self.icon.removeClass('glitch');
			}, 2000)
		}

		function build() {
			self.addClass('gnomon');
			self.body = $('body');

			buildInput();
			buildIcon();
			buildOutput();
			buildOverlays();
			attachEventListeners();
		}

		function buildInput() {
			self.inputDisplay = $('<div/>').addClass('input center').appendTo(self);
			self.inputHidden = $('<input/>').addClass('input-box').appendTo(self);
		}

		function buildIcon() {
			self.iconWrapper = $('<div/>').addClass('icon-wrapper').appendTo(self);
			self.icon = $('<div/>').html('<span class="fa fa-eye"></span>').addClass('icon float center').appendTo(self.iconWrapper);
		}

		function buildOutput() {
			self.outputDisplay = $('<div/>').addClass('output center').appendTo(self);
		}

		function buildOverlays() {
			self.credits = $('<div/>').addClass('credits overlay').text('Chief Programmer: Sergio Rodriguez').appendTo(self.body);
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

				handleInput().done(function() {
			       	clearInput();
			       	setTimeout(clearOutput,3000);
					self.outputDebounce = false;
				});
			}
		}

		function handleInput() {
			var val = convertInputToCommand(self.inputHidden.val()),
				command = commands[val],
				dfd = $.Deferred();

			showIcon();
			if(command.action && $.isFunction(command.action)) {
				executeAction(dfd, command.action);
			}

			if(command.response) {
				typeText(dfd, randomItem(command.response));
			}

			return dfd.promise();
		}

		function executeAction(dfd, action) {
			action();
			dfd.resolve();
		}

		function convertInputToCommand(input) {
			var command;

			input = input && input.trim().toLowerCase();

			$.each(commands, function(name, obj) {
				if(obj.input && obj.input.includes(input)) {
					command = name;
					return;
				}
			});

			if(!command) {
				$.each(commands, function(name, obj) {
					if(obj.match) {
						$.each(obj.match, function(i,regex) {
							if(input.match(regex)) {
								command = name;
								return;
							}
						});
					}
					if(command) {
						return;
					}
				});				
			}


			return command || 'default';
		}

		function invert() {
			$('body').toggleClass('invert');
		}

		function defaultResponse() {
			typeText(getResponse());
		}

		function typeText(dfd, text, typeSpeed) {
			typeSpeed = typeSpeed || 150;
			var textArray = text && text.split('');

			typeLetter(dfd, textArray, typeSpeed);
		}

		function typeLetter(dfd, stringArray, typeSpeed, index) {
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
					typeLetter(dfd, stringArray, typeSpeed, index)
				}, typeSpeed);
			} else {
				dfd.resolve();
			}
		}

		function clearOutput() {
			self.outputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.outputDisplay.removeClass('vanish');
		    	self.outputDisplay.html('');
		    }, 1000)
		}

		function clearInput() {
			self.inputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.inputDisplay.removeClass('vanish');
		    	self.inputDisplay.text('');
		    	self.inputHidden.val('');
		    }, 1000);
		}

		function showIcon() {
			self.icon.removeClass('wink').addClass('float');
			self.iconWrapper.removeClass('vanish');
		}

		function winkOutIcon() {
			self.icon.addClass('wink').removeClass('float');
			self.iconWrapper.addClass('vanish');
		}

		build();
	}
	$.fn.gnomon.defaults = {
	};
}(jQuery))

