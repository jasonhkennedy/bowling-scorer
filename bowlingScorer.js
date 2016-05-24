'use strict';

var bowlingData = require('./bowlingData');

var bowlingScorer = (function() {

	function BowlingScorer() {}

	BowlingScorer.prototype = {
		scoreStrike: function (currentFrame, nextRoll, thirdRoll) {
			if (currentFrame.roll1 === '') {
				// Strike is first roll
				currentFrame.roll1 = 'X';
				
				if (nextRoll !== '' && thirdRoll !== '') {
					// Calculate the frame value
					// from the next two rolls
				
					var frameValue = 10;
					if (nextRoll.value + thirdRoll.value === 10) {
						// Frame after strike is finished by spare
						frameValue += 10;
					} else {
						frameValue += nextRoll.value;
						frameValue += thirdRoll.value;
					}
					
					currentFrame.value = frameValue;
				}
			} else if (currentFrame.roll2 === '') {
				// Check if the last frame
				if (currentFrame.num === 10) {
					// Strike is second roll in frame 10
					currentFrame.roll2 = 'X';
				} else {
					// Strike can't be in the second roll
					throw 'No strikes in the second roll except last frame';
				}
			} else if (currentFrame.roll3 === undefined && currentFrame.num === 10) {
				// Strike is third roll in frame 10
				currentFrame.roll3 = 'X';
			}
		},
		scoreSpare: function (currentFrame, nextRoll) {
			var frameValue = 10;
			if (nextRoll !== undefined) {
				// Calculate the frame value
				// from the next roll
				frameValue += nextRoll.value;
			}
			currentFrame.roll2 = '/';
			currentFrame.value = frameValue;
		},
		tryGetScore: function (rolls) {
			var jsonReturn = {};
	
			if(rolls.length > 21) {
				// Can't have more than 21 rolls in a game
				throw "More than 21 rolls";
			} else {
				var frames = [];
				var score = 0;

				var frameCounter = 1;
				var currentFrame = bowlingData.newFrame(frameCounter);
				
				// Parse out the rolls into frames
				for(var i = 0; i < rolls.length; i++) {
					var currentRoll, nextRoll = '', thirdRoll = '';
					
					currentRoll = bowlingData.newRoll(rolls[i]);
					if (rolls.length > (i + 1)) {
						nextRoll = bowlingData.newRoll(rolls[i+1]);
					}
					if (rolls.length > (i + 2)) {
						thirdRoll = bowlingData.newRoll(rolls[i+2]);
					}
					
					if (currentRoll.isStrike()) {
						// Strike!
						this.scoreStrike(currentFrame, nextRoll, thirdRoll);
					} else {
						// Not a strike
						if (currentFrame.roll1 === '') {
							// Update roll 1 with pins knocked down
							currentFrame.roll1 = currentRoll.string;
							currentFrame.value = currentRoll.value;
						} else if (currentFrame.roll2 === '') {
							// Check for a spare in second roll
							var potentialFrameTotal = parseInt(currentFrame.roll1) + currentRoll.value;
							if (potentialFrameTotal > 10) {
								// Too many pins
								throw 'Too many pins in second roll';
							} else if (potentialFrameTotal === 10) {
								// Spare!
								this.scoreSpare(currentFrame, nextRoll);
							} else {
								// Update roll 2 with pins knocked down
								currentFrame.roll2 = currentRoll.string;
								currentFrame.value += currentRoll.value;
							}
						} else {
							// A third roll from the last frame
							// Value is already present in frame
							// from the previous strike or spare
							currentFrame.roll3 = currentRoll.string;
						}
					}
					
					if (currentFrame.isFinished()) {
						// Update our current score
						score += currentFrame.value;
						
						frames.push(currentFrame);
						
						// Create new frame
						frameCounter++;
						currentFrame = bowlingData.newFrame(frameCounter);
					}
				}
			}
			
			// Create a link back to this game
			var links = [];
			var self = {};
			self.rel = 'self';
			self.href = '/v1/games/' + rolls;
			links.push(self);
			
			jsonReturn.score = score;
			jsonReturn.frames = frames;
			jsonReturn.links = links;
			
			return jsonReturn;
		}
	}
	
	return {
		newScorer: function() {
			return new BowlingScorer();
		},
		getScore: function (rolls, callback) {
			var response = {};
			var error;
			var scorer = this.newScorer();
			
			try {
				response = scorer.tryGetScore(rolls);
				error = false;
			} catch (err) {
				response.errorDetails = err;
				error = true;
			}
			
			callback(error, response);
		},
		getScoreAddRoll: function(rolls, roll, callback) {
			var response = {};
			var error;
			var scorer = this.newScorer();
			
			// Convert a 10 to a strike
			if (parseInt(roll) === 10) {
				roll = 'X';
			}
			rolls += roll;
			
			try {
				response = scorer.tryGetScore(rolls);
				error = false;
			} catch (err) {
				response.errorDetails = err;
				error = true;
			}
			
			callback(error, response);
		}
	};
})();
module.exports = bowlingScorer;