function createPartyApp(myself) {
		
	myself = myself || {};

	myself.interval;
	myself.isSurprised = false;	
	
	myself.min = 11184810;
	myself.max = 14540253;
	myself.delay = 300;
	
	myself.init = function(min, max, delay, isSupriseMode) {
		myself.min = min;
		myself.max = max;
		myself.delay = delay;
		myself.isSupriseMode = isSupriseMode;
		if (isSupriseMode) {
			initSurpriseMode();
		} else {
			startParty();
		}		
	};
	
	function party() {
		var min = myself.min;
		var max = myself.max;
		var elements=document.getElementsByTagName('*');
		for(var i=0;i<elements.length;i++) {
			var e = elements[i];
			if (e.className.indexOf('no-party') == -1)
				elements[i].style.background= '#'+Math.floor(min+(Math.random()*(max-min))).toString(16);
		  }
	};
	
	function startParty() {
		insertAd();
		myself.interval = setInterval(party, myself.delay);
	};
	
	var stopParty = myself.stopParty = function() {
		clearInterval(myself.interval);
		var elements=document.getElementsByTagName('*');		
		for(i=0;i<elements.length;i++) {
			var e = elements[i];
			e.style.background='';
			if (e.id == 'partyScriptAd')
				e.parentNode.removeChild(e);				
		}
	};
	
	function initSurpriseMode() {
		function bindMouseMoveEvent() {
			window.onmousemove = function() {
				if (!myself.isSurprised) {
					startParty();
					myself.isSurprised = true;
				}
			};
		};
		
		setTimeout(bindMouseMoveEvent, 5000);
	};
	
	function insertAd() {
		var html = [
			'<div id="partyScriptAd" class="no-party" style="position:fixed;',
				'bottom:0;',
				'font-family: Arial;',
				'line-height: 1;',
				'font-size: 12px;',
				'right:0;',				
				'z-index:100000;',
				'background:#ffa;',
				'border:1px solid #999;',
				'border-bottom: none;',
				'border-right: none;',
				'border-top-left-radius: 4px;',
				'font-style: normal;',
				'font-variant: normal;',
				'font-weight: normal;',								
				'padding:0.5em 0.5em 0.5em 1.5em">',
			'<a class="no-party" href="https://wstabosz.github.io/PartyScript/" target="_blank">PartyScript</a>&nbsp;',
			'<a class="no-party" style="',
				'position: absolute;',
				'top: 0;',
				'left: 0;',
				'font-size: 15px;',
				'line-height: 10px;',
				'height: 10px;',
				'padding: 2px;',
				'background: #000;',
				'color: #fff;',
				'text-decoration: none;',
				'box-sizing: content-box;',
				'border-top-left-radius: 3px;',
				'border-bottom-right-radius: 3px;}"',
				' href="javascript:partyApp.stopParty();">x</a>',
			'</div>;'
		].join('');
		var element = document.createElement('div');
		element.innerHTML = html;
		document.body.appendChild(element);
	}

	return myself;		
	
};

function getPartyScript(options) {
	
	options.min = options.min || 11184810;
	options.max = options.max || 14540253;
	options.delay = options.delay || 300;
	options.isSupriseMode = options.isSupriseMode || false;

	var pieces = createPartyApp.toString().split('\n');
	
	for(var i=0;i<pieces.length;i++) 
		pieces[i] = pieces[i].trim();
	
	pieces.push(
		';partyApp = createPartyApp();',
		'partyApp.init(',
		[options.min,options.max,options.delay,options.isSupriseMode].join(','),
		');'
	);
	
	var result = pieces.join('');
	return result;	
}
