'use strict';

var bowlingScorer = require('./bowlingScorer');

var score;

/*
	Happy path cases
*/
score = bowlingScorer.getScore('XXXXXXXXXXXX', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('00000000000000000000', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('11111111111111111111', function(error, response) {
	console.log(response);
});

/*
	Partial games
*/

score = bowlingScorer.getScore('X', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('XXX12', function(error, response) {
	console.log(response);
});

/*
	Error cases
*/

score = bowlingScorer.getScore('/', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('1X', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('1//', function(error, response) {
	console.log(response);
});

score = bowlingScorer.getScore('A', function(error, response) {
	console.log(response);
});

/*
	Random cases
*/

score = bowlingScorer.getScore('X737291XXX2364733', function(error, response) {
	console.log(response);
});