'use strict';

var bowlingData = (function() {

	function Roll(rollString) {
		this.string = rollString;
		this.value = 0;
	
		if (rollString === 'X') {
			this.value = 10;
		} else {
			this.value = parseInt(rollString);
			if(isNaN(this.value)) {
				throw 'Invalid roll \'' + rollString + '\'';
			}
		}
	}
	
	Roll.prototype = {
		isStrike: function() {
			return this.string === 'X';
		},
		isSpare: function() {
			return this.string === '/';
		}
	}
	
	function Frame(num) {
		this.num = num;
		this.roll1 = '';
		this.roll2 = '';
		this.value = 0;
	}
	
	Frame.prototype = {
		isFinished: function() {
			var finished = false;
			
			if (this.num === 10) {
				// Last frame
				if (this.roll3 !== undefined) {
					// Having a third roll means we're finished
					finished = true;
				} else if (this.roll2 === '/' || this.roll2 === 'X') {
					// We get one more roll
					finished = false;
				} else if (this.roll2 !== '') {
					// No spares or strikes in last frame, we're finished
					finished = true;
				}				
			} else {
				if (this.roll2 !== '' || this.roll1 === 'X') {
					// Not the last frame, we've rolled twice or a strike
					finished = true;
				}
			}
			
			return finished;
		}
	}

	return {
		newRoll: function(rollString) {
			return new Roll(rollString);
		},
		newFrame: function(num) {
			return new Frame(num);
		}
	};
	
})();
module.exports = bowlingData;