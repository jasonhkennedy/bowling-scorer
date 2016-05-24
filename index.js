'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var bowlingScorer = require('./bowlingScorer');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
GET /games/:rolls
*/
app.get('/v1/games/:rolls', function (req, res) {
	var rolls = req.params.rolls;
	
	bowlingScorer.getScore(rolls, function(err, response) {
		if (err) {
			res.status(400);
			res.send(response);
		} else {
			res.status(200);
			res.send(response);
		}
	});
})

/*
POST /games
{ "Roll": Number }
*/
app.post('/v1/games', function (req, res) {
	var rolls = '';
	var roll = req.body.roll;
	
	bowlingScorer.getScoreAddRoll(rolls, roll, function(err, response) {
		if (err) {
			res.status(400);
			res.send(response);
		} else {
			res.status(200);
			res.send(response);
		}
	});
})

/*
POST /games/:rolls
{ "Roll": Number }
*/
app.post('/v1/games/:rolls', function (req, res) {
	var rolls = req.params.rolls;
	var roll = req.body.roll;
	
	bowlingScorer.getScoreAddRoll(rolls, roll, function(err, response) {
		if (err) {
			res.status(400);
			res.send(response);
		} else {
			res.status(200);
			res.send(response);
		}
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Bowling Scorer listening on port ", port)

})
