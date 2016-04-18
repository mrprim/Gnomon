(function($) {
	'use strict';
	$.fn.gnomon = function(options) {
		var self = this,
			opts = $.extend({}, $.fn.gnomon.defaults, options),
			code = [];

		var rituals = {
			minor: [],
			significant: [],
			major: []
		};

		var commands = {
			invert: {
				code: [[38,38,40,40,37,39,37,39,65,66,65,66]],
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
				match: [/ain/],
				response: ['MAAAAAGIC!']
			},
			error: {
				input: ['error'],
				action: glitch,
				response: ['error']
			},
			default: {
				response: ['...']
			},
			charges: {
				match: [/score/],
				action: showCharges
			},
			gainMinorCharge: {
				match: [/charge/],
				action: gainMinorCharge
			}

		};

		var user = {
			charges: {
				minor: 0,
				significant: 0,
				major: 0
			}
		};

		function randomItem(array) {
			return array[Math.floor(Math.random()*array.length)];
		}

		function showCredits() {
			reveal(self.credits);
		}

		function showCharges() {
			self.charges.text('');
			self.charges.append('<div>Minor Charges: ' + user.charges.minor + '</div>');
			self.charges.append('<div>Significant Charges: ' + user.charges.significant + '</div>');
			self.charges.append('<div>Major Charges: ' + user.charges.major + '</div>');
			reveal(self.charges);
		}

		function gainMinorCharge() {
			user.charges.minor += 1;
			showCharges();
		}

		function glitch() {
			self.icon.addClass('glitch');
			setTimeout(function() {
				self.icon.removeClass('glitch');
			}, 2000);
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
			self.credits = $('<div/>').addClass('credits overlay').text('Chief Architect: Sergio Rodriguez').appendTo(self.body);
			self.charges = $('<div/>').addClass('charges overlay').text('No Charges').appendTo(self.body);
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
					code = [];
			    	return;
			    }
			    code.push(e.which);
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

			command = inputIsACommandCode(command);
			command = inputIsACommandInput(input, command);
			command = inputIsACommandMatch(input, command);

			return command || 'default';
		}

		function inputIsACommandCode(command) {
			if(command) {
				return command;
			}
			$.each(commands, function(name, obj) {
				if(obj.code) {
					$.each(obj.code, function(j, nCode) {
						if(arraysEqual(code, nCode)) {
							command = name;
							return;
						}
					});
					if(command) {
						return;
					}
				}
			});
			return command;
		}

		function inputIsACommandInput(input, command) {
			if(command) {
				return command;
			}

			$.each(commands, function(name, obj) {
				if(obj.input && obj.input.includes(input)) {
					command = name;
					return;
				}
			});

			return command;			
		}

		function inputIsACommandMatch(input, command) {
			if(command) {
				return command;
			}

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

			return command;
		}

		function arraysEqual(a, b) {
		  if (a === b) return true;
		  if (a === null || b === null) return false;
		  if (a.length != b.length) return false;

		  for (var i = 0; i < a.length; ++i) {
		    if (a[i] !== b[i]) return false;
		  }
		  return true;
		}

		function invert() {
			$('body').toggleClass('invert');
		}

		function typeText(dfd, text, typeSpeed) {
			typeSpeed = typeSpeed || 150;
			var textArray = text && text.split(''),
				output = $('<div/>').prependTo(self.outputDisplay);

			typeLetter(dfd, output, textArray, typeSpeed);
		}

		function typeLetter(dfd, display, stringArray, typeSpeed, index) {
			index = index || 0;
			var char;

			if(index < stringArray.length) {
				char = stringArray[index];
				if(char === '\n') {
					char = '<br/>';
				}
				display.append(char);
				index = ++index;
				setTimeout(function() {
					typeLetter(dfd, display, stringArray, typeSpeed, index);
				}, typeSpeed);
			} else {
				dfd.resolve();
				setTimeout(function() {
					clear(display);
				}, 3000);
			}
		}

		function reveal(obj) {
			obj.addClass('reveal');
			setTimeout(function() {
				obj.removeClass('reveal');
			}, 10000);
		}

		function clear(obj) {
			obj.addClass('vanish');
		    setTimeout(function() {
		    	obj.removeClass('vanish');
		    	obj.html('');
		    }, 1000);
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

