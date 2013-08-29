(function() {

	var isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	var bpm,
		timer,
		on = false,
		currentBeat = 0,
		tapTempoTimes = [];
		
	var	$note = document.getElementById('note'),
		$bpm = document.getElementById('bpm'),
		$tapTempo = document.getElementById('tapTempo'),
		$numerator = document.getElementById('numerator'),
		$denominator = document.getElementById('denominator'),
		$soundOn = document.getElementById('soundOn'),
		$beat = document.getElementById('beat'),
		$startStop = document.getElementById('startStop'),
		$soundHigh = document.getElementById('soundHigh'),
		$soundLow = document.getElementById('soundLow');
	
	document.getElementById('buttonHelp').onclick = function() {
		toggleScreen();
	};
	document.getElementById('buttonBack').onclick = function() {
		toggleScreen();
	};
	var toggleScreen = function() {
		if (document.getElementById('helpIcon').className === 'glyphicon glyphicon-question-sign') {
			document.getElementById('helpIcon').className = 'glyphicon glyphicon-chevron-left';
			document.getElementById('containerMain').style.display = 'none';
			document.getElementById('containerHelp').style.display = 'block';
		} else {
			document.getElementById('helpIcon').className = 'glyphicon glyphicon-question-sign';
			document.getElementById('containerMain').style.display = 'block';
			document.getElementById('containerHelp').style.display = 'none';
		}
	};
	
	
	var setBPM = function(newBPM) {
		if (isNumber(newBPM) && newBPM >= 20 && newBPM <= 250) {
			bpm = parseInt(newBPM);
		} 
		$bpm.value = bpm;
	};
	setBPM(120);
	$bpm.onchange = function() {
		setBPM($bpm.value);
	};
	document.getElementById('bpmMinus').onclick = function() {
		setBPM(bpm - 1);
	};
	document.getElementById('bpmAdd').onclick = function() {
		setBPM(bpm + 1);
	};

	$tapTempo.onclick = function() {
		
		//get current time
		var currentTime = new Date().getTime();

		// check any previously stored times are recent
		if (tapTempoTimes.length) {

			// if there has been too much of a delay between beats - set this as the first beat
			if (tapTempoTimes[tapTempoTimes.length - 1] >= (currentTime - 2500)) {

				// if this has come too quickly after the last beat, cancel tap tempo
				if (tapTempoTimes[tapTempoTimes.length - 1] >= (currentTime - 250)) {
					tapTempoTimes = [];
				} else {
					tapTempoTimes.push(currentTime);

					// if we have at least 2 times change the tempo
					if (tapTempoTimes.length >= 2) {
						setBPM(parseInt(60000 / ((tapTempoTimes[tapTempoTimes.length - 1] - tapTempoTimes[0]) / (tapTempoTimes.length - 1))));
						tapTempoTimes = [];
					}

				}

			} else {
				tapTempoTimes = [currentTime];
			}
			
		} else {
			tapTempoTimes.push(currentTime);
		}
		
	};

	$numerator.onchange = function() {
		if ($denominator.value === '8') { // only certain compound numerators are allowed
			if ($numerator.value % 3 !== 0) {
				$denominator.value = '4';
			}
		}
	}
	$denominator.onchange = function() {
		if ($denominator.value === '4') {
			$note.src = 'resources/Crotchet.jpg';
		} else {
			$note.src = 'resources/Dotted crotchet.jpg';
			if ($numerator.value % 3 !== 0) { // only certain compound numerators are allowed
				$numerator.value = '6';
			}
		}
	};
	$numerator.value = '4';
	$denominator.value = '4';

	$startStop.onclick = function() {
		on = !on;
		if (on) {
			currentBeat = 0;
			$startStop.innerHTML = 'Stop';
			beat();
		} else {
			clearInterval(timer);
			$startStop.innerHTML = 'Start';
		}
	};
	
	var beat = function() {
		
		if (currentBeat >= parseInt($numerator.value)) {
			currentBeat = 1;
		} else {
			currentBeat++;
		}
		$beat.innerHTML = currentBeat;
		
		if ($soundOn.checked) {
			if (currentBeat === 1) {
					$soundHigh.load();
					$soundHigh.play();
			} else if ($denominator.value === '4' || currentBeat === 4 || currentBeat === 7 || currentBeat === 10) { // only play on dotted crotchet beats if in compound time
				$soundLow.load();
				$soundLow.play();
			}
			
		}
		
		var delay;
		if ($denominator.value === '4') {
			delay = 60000 / bpm;
		} else {
			delay = 20000 / bpm;
		}
		
		if (on) {
			window.setTimeout(beat, delay);
		}
		
	};
	

})();
