
/*
http://www.looperman.com/loops/detail/77931
http://www.looperman.com/loops/detail/78034
TODO: fix the issue where the delay doesn't update immediately
*/

(function() {
	
	var defaults = {
		min: 14000000,
		max: 16777215,
		animateDelay: 300	
	};
	
	var settings = {
		min: 14000000,
		max: 16777215,
		animateDelay: 300,
		preview: false,
		showSafetyWarning: false,
		onSafetyWarningContinue: null,
		isSupriseMode: true,
		timeout: null
	};

	$(function () {            
		init();			
	});				

	function init() {		
		
		var $header = $('#header');
		partyText($header);
		setInterval(function() {
			partyText($header);
		}, 100);
		
		initForm();
		setScripts(settings);
					
		$('#max,#min,#animateDelay').on('input', function(e) {
			
			settings.min = parseInt($('#min').val()) || 0;
			settings.max = parseInt($('#max').val()) || 16777215;
			
			if (settings.min > settings.max) {
				var t = settings.max;
				settings.max = settings.min;
				settings.min = t;
			}
			
			settings.animateDelay = parseInt($('#animateDelay').val()) || 300;
			
			if (settings.max > 16777215) 
				settings.max = 16777215;
			
			if (settings.min > 16777215) 
				settings.min = 16777215;
			
			onSettingsChange();
			
		}).on('keypress', function(e) {
			// disallow non-numbers in the inputs
			 var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];

			 if (!($.inArray(e.which, key_codes) >= 0)) {
			   e.preventDefault();
			 }
		});
	   
		$('#bookmarklet').on('click',function(e) {
			// don't run the party script from the install bookmarklet
			e.preventDefault();
		});
		
		$('#bookmarkletName').on('input', function(e) {
			var name = $(this).val();
			$('#bookmarklet').text(name);
		});
		
		$('#previewStart,#previewStop,#previewGlobal').on('change',function() {
			settings.preview = $('#previewStart').prop('checked');
			settings.previewGlobal = $('#previewGlobal').prop('checked');
			showSafetyWarning(party);
		});
		
		
		$('#installButton').on('click', function() {			
			showSafetyWarning(showInstallModal);			
		});
		
		$('#warningContinueButton').on('click', function() {
			settings.showSafetyWarning = false;
			$('#safetyModal').modal('hide');
			settings.onSafetyWarningContinue();
		});
		
		$('#warningCancelButton').on('click', function() {	
			pressStopButton();
			$('#safetyModal').modal('hide');
		});
		
		$('#partyModeInstant,#partyModeSurprise').on('click', function(e) {
			settings.isSupriseMode = $('#partyModeSurprise').prop('checked');
			onSettingsChange();
		});
		
		$('#uninstallPanel').on('mouseover', function() {
			$('#uninstallInstructions').show('fade');
		});
		
		$('#resetSettings').on('click', function() {
			resetSettings();
		});
		
		$('[data-toggle="tooltip"]').tooltip();
		
	}

	function initForm() {
		$('#min').val(settings.min);
		$('#max').val(settings.max);
		$('#animateDelay').val(settings.animateDelay);
	}
	
	function resetSettings() {	
		settings = $.extend({},settings,defaults);
		initForm();
		onSettingsChange();
	}
	
	function onSettingsChange() {
		setScripts(settings);
		clearTimeout(settings.timeout);
		if (!settings.showSafetyWarning) {
			party();
		}
	}
	
	function showSafetyWarning(onContinue) {
				
		onContinue = onContinue || $.noop;
		settings.onSafetyWarningContinue = onContinue;
		if(settings.showSafetyWarning) {
			$('#safetyModal').modal('show');
			return;
		} else {
			onContinue();
		}
	}

	function pressStopButton() {
		$('#previewButtons label').removeClass('active');
		$('#previewStop').prop('checked',true)
			.parents('label').addClass('active');
	}

	function textToSpans(text) {
		
		// given some text, return a block of html with that text split into spans
		var letters = text.split('');
		var pieces = [];
		
		for(var i=0;i<letters.length;i++) {	
			pieces.push('<span >');
			pieces.push(letters[i]);
			pieces.push('</span>');
		}
		
		var result = pieces.join('');
			
		return result;
		
	}

	function partyText($element) {

		if (!($element instanceof jQuery))
			$element = $($element);	
		
		if (!$element.attr('party-mode')) {
			$element.html(textToSpans($element.text()));
			$element.attr('party-mode',true);
		}
		
		$.each($element.find('span'), function() {
			var color = getRandomColor();
			$(this).css('color',color);
		});

	}

	function getRandomColor() {
		var b = settings.max;
		var a = settings.min;
		var result = '#'+Math.floor(a+(Math.random()*(b-a))).toString(16);
		return result;
	}

	function party() {		
		
		var selector = settings.preview ? '#preview,#preview *' : '*';
		
		var $elements = $(selector);
		
		if(settings.preview || settings.previewGlobal) {
			$elements.each(function() { 
				var b = settings.max;
				var a = settings.min;
				var background = '#'+Math.floor(a+(Math.random()*(b-a))).toString(16);
				$(this).css('background-color', background);
			});
			settings.timeout = setTimeout(party,settings.animateDelay);
		} else {
			$elements.each(function() { 
				$(this).css('background-color', '');
			});
		}			
		
	}

	function showInstallModal() {		
		$('#installModal').modal('show');
	}
		
	function setScripts(options) {		
		var script = getPartyScript(options);
		$('#bookmarklet').attr('href', 'javascript:' + script);
	}
	
})();			