'use strict';
(function($) {
	$.fn.gnomon = function(options) {
		var self = this,
			opts = $.extend({}, $.fn.gnomon.defaults, options),
			responses = [
			'AFFIRMATIVE',
			'NEGATIVE',
			'WARNING\nILLEGAL ACTIVITY DETECTED'
		]


		function _build() {
			self.addClass('gnomon');

			_buildIcon();
			_buildInput();
			_buildOutput();
			_attachEventListeners();
		}

		function _buildInput() {
			self.inputDisplay = $('<div/>').addClass('input').addClass('center').appendTo(self);
			self.inputHidden = $('<input/>').addClass('input-box').appendTo(self);
		}

		function _buildIcon() {
			self.icon = $('<div/>').addClass('triangle').addClass('center').appendTo(self);
		}

		function _buildOutput() {
			self.outputDisplay = $('<div/>').addClass('output').addClass('center').appendTo(self);
		}

		function _attachEventListeners() {
			_catchAllClicks();
			_typeInInput();
		}

		function _catchAllClicks() {
			$(document).on('click keydown', function() {
				self.inputHidden.focus();
			});			
		}

		function _typeInInput() {
			self.inputHidden.on('keyup',function(e, ev) {
				if(e.which == 13) {
					_submit();
			    	return;
			    }
			    _updateInputDisplay();
			});

		}

		function _updateInputDisplay() {
			self.inputDisplay.text($('.input-box').val());
		}

		function _submit() {
			if(!self.outputDebounce) {
				self.outputDebounce = true;
				_handleInput();
		       	_clearInput();
			}
		}

		function _handleInput() {
			var val = self.inputHidden.val().toUpperCase(),
				response;

			if(val === 'INVERT') {
				_invert();
			} else {
				_defaultResponse();
			}

		}

		function _invert() {
			$('body').addClass('invert');
			self.outputDebounce = false;

			setTimeout(function() {
				$('body').removeClass('invert');
			},15000);
		}

		function _defaultResponse() {
			_typeText(getResponse());
		}

		function _typeText(text, typeSpeed) {
			typeSpeed = typeSpeed || 150;
			var textArray = text && text.split('');

			_typeLetter(textArray, typeSpeed);
		}

		function _typeLetter(stringArray, typeSpeed, index) {
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
					_typeLetter(stringArray, typeSpeed, index)
				}, typeSpeed);
			} else {
				setTimeout(function() {
					_clearOutput();
				}, 2000);
			}
		}

		function _clearOutput() {
			self.outputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.outputDisplay.removeClass('vanish');
		    	self.outputDisplay.html('');
		    	self.outputDebounce = false;

		    }, 1000)
		}

		function _clearInput() {
			self.inputDisplay.addClass('vanish');
		    setTimeout(function() {
		    	self.inputDisplay.removeClass('vanish');
		    	self.inputDisplay.text('');
		    	self.inputHidden.val('');
		    }, 1000);
		}

		function getResponse() {
			return responses[Math.floor(Math.random() * responses.length)];
		}

		_build();
	}
	$.fn.gnomon.defaults = {
		afterBuild:function() {}
	};
}(jQuery))

