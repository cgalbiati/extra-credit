'use strict';

var score = require('./calc-score/score');
var data = require('./test/test-data');
var Promise = require('bluebird');

//will store business objects for mapped promises
var businesses = ['bondSt', 'pekoe', 'banhMi', 'fullstack'];
// console.log(data)

//calc and print scores
//Promise.map or .all would be faster, but Google keeps blocking me, so this ensures they will fire at uneven intervals depending on returns from all the other APIs
//setTimeout attempts to thwart the bot-filter because apparently a 12-16 second threshold will do the trick
Promise.reduce(businesses, function(nothing, bus){
  // console.log(null, bus, data[bus])
  var businessInfo = data[bus];
  return score.calcFinalScore(businessInfo)
    .then(function(score){
      console.log('Score for', businessInfo.name, ': ', score);
    })
    .then(function(){
      return new Promise(function(fulfill, reject){
        console.log('waiting to thwart bot detection...');
        setTimeout(function(){
          fulfill('Are you happy Google?');
        }, Math.random() * 12000 + 12000);
      });
    });
}, null);