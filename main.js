'use strict';

var input = require('./input/command-line');
var score = require('./calc-score/score');

input.getBusinessInfo()
.then(function(businessObj) {
  console.log('Calculating score for', businessObj.name, "Please wait...");
  return score.calcFinalScore(businessObj);
})
.then(function(score){
  console.log('Your score is:', score);
})
.catch(function(err){
  console.error('Sorry, there was an error', err.message);
});