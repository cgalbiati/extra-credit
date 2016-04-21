'use strict';

var apiReqs = require('./api.js');
var Promise = require('bluebird');
var test = require('../test/test-data');

//maps name in api module to score function
var apiToScoreFn = {
  yelpSearch: scoreYelp,
  twitter: scoreTwitter,
  glassdoor: scoreGlassDoor,
  googleSearchTrends: scoreGoogleTrends,
  googleStub: scoreGoogleTrends

};

//maps name to weight
var apiWeights = {
  yelpSearch: 0.6,
  twitter: 0.2,
  googleSearchTrends: 0.4,
  glassdoor: 0.5
};

//returns object with api/score (between -1 and 1) ex: {yelp: 0.5, googleTrends: -0.2}
//takes an object with keys: name, location, phone, website
function calcApiScores(businessInfo){
  var apiNames = ['yelpSearch', 'twitter', 'glassdoor', 'googleSearchTrends'];

  //search APIs
  return Promise.map(apiNames, function(apiName){
    return apiReqs[apiName](businessInfo)
      .then(function(data){
        //calculate scores
        var score = Promise.resolve(apiToScoreFn[apiName](data));
        return score;
      })
      .catch(function(err){
        console.error('error getting score for', apiName, err.message);
      });
    })
    .then(function(scores){
      //transform array of scores into dictionary for clarity later
      return {
        yelpSearch: scores[0],
        twitter: scores[1],
        glassdoor: scores[2],
        googleSearchTrends: scores[3]
      };
    })
    .catch(function(err){
      console.error('error transforming scores', err.message);
    });
}

//returns overall weighted P score
function sumScores(apiScoreObj){
  var score = 0;
  for (var api in apiScoreObj){
    //multiply score times weight
    score += apiWeights[api] * apiScoreObj[api];
  }
  //score maxes out at -1 and 1
  if(score > 1) score = 1;
  else if (score < 0) score = 0;
  return score;
}

//takes business object and returns final score
function calcFinalScore(businessInfo){
  return calcApiScores(businessInfo)
    .then(function(apiData){
      return sumScores(apiData);
    });
}




//score functions all return a number between -1 and 1

//returns score between -1 and 1 depending on number of reviews and rating
//data contains business data
// ** has keys: is_closed, review_count, rating 
function scoreYelp(data){
  //if not found return 0
  if(!data) return 0;
  //if business is closed return -1
  if (data.is_closed === true) return -1;

  //weight num reviews by rating
  var weightedRating = Number(data.review_count) + Number(data.review_count) * (Number(data.rating) - 2.5);

  return calcWeightedTotal(weightedRating, 100);
}

// returns score between -1 and 1 depending on number of reviews weighted by percentage of good to bad sentiments
//data is {pos: {tweetsData}, neg: {tweetsData}, all: {tweetsData}}
//key.statuses gives tweet objects
function scoreTwitter(data){
  //TODO: analyze for tweets over extended time - stability?
  var posTweets = data.pos.statuses.length;
  var negTweets = data.neg.statuses.length;
  var allTweets = data.all.statuses.length;

  //calc percent of attitude-ed tweets are positive
  var percentPos = null;
  if (negTweets > 0) percentPos = posTweets/negTweets;
  else if (posTweets > 0) percentPos = 1;

  //weight total by percent pos 
  if (percentPos !== null) allTweets += allTweets * (percentPos - 0.5) * 2;

  //assign score based on total tweets
  return calcWeightedTotal(allTweets, 100);
}

//returns score between -1 and 1 depending on number score and change over time for business name and industry in the last 3 years
//points awarded for high trends or increasing trends from name and/or industry (full scores for name and industry would be 1.4)
//data is {name: [{year/month: score}], industry: [{year/month: scores}]}
function scoreGoogleTrends(data){
  //if google trends had problems, return 0 
  //this api has a low limit, 
  if(!(data.name && data.industry)) return 0;
  //calc score for industry
  var industrySums = sumYrTotals(data.industry);
  //Points for increasing (from -.2 to .2)
  var indChangePts = calcChangePts(industrySums, 0.2);
  //points for high recent yr sum from -.3 to .3
  var recentIndPts = calcWeightedTotal(industrySums[0], 2000) * 0.6 - 0.3;

  //points for high recent sum (from -.4 to .8)

  var nameSums = sumYrTotals(data.name);
  //Points for increasing (from -.3 to .3)
  var nameChangePts = calcChangePts(nameSums, 0.3);
  //points for high recent yr sum from -.5 to .5
  var recentNamePts = calcWeightedTotal(nameSums[0], 800) - 0.5;
  //award up to 0.1 points for being on the radar 3 years ago
  var oldPoints = calcWeightedTotal(nameSums[2], 100) * 0.1;

  return indChangePts + recentIndPts + nameChangePts + recentNamePts + oldPoints;
}

//returns a score from -weight to weight 
//maxes out at 100% change
function calcChangePts(sumsArr, weight){
  //calc percent change and weight first interval double (100% inc in both will result in 3)
  var weightedPercents =  ((sumsArr[0] - sumsArr[1]) / sumsArr[1] * 2) + (sumsArr[1] - sumsArr[2]) / sumsArr[2];
  //return weighted total (between -1 and 1 times weight given to this percent)
  return calcWeightedTotal(weightedPercents, 3) * weight;
}

//returns an array of totals for each of the last 3 years in desc order (most recent first)
function sumYrTotals(yrsDataArr){
  var length = yrsDataArr.length;

  var yr0 = yrsDataArr.slice(length - 12);
  var yr1 = yrsDataArr.slice(length - 24, length - 12);
  var yr2 = yrsDataArr.slice(length - 36, length - 24);

  return [yr0, yr1, yr2].map(function(monthsSlice){
    //sum the values for the months in each slice
    return monthsSlice.reduce(function(sum, month){
      //acccess value without knowing key (each month has dift key of month year)
      for (var key in month) {
        return sum += Number(month[key]);
      }
    }, 0);
  });
}

//returns score form -1 to 1 depending on number of reviews and rating
//data should have keys 
function scoreGlassDoor(data){
  //if not found on glassdoor return 0
  if (!data) return 0;

  //weight num reviews by rating
  var weightedRating = Number(data.numberOfRatings) + Number(data.numberOfRatings) * (Number(data.overallRating) - 2.5);

  return calcWeightedTotal(weightedRating, 10);
}


function calcWeightedTotal(total, max){
  var weightedTotal = total/max;
  if(weightedTotal > 1) weightedTotal = 1;
  else if(weightedTotal < -1) weightedTotal = -1;
  return weightedTotal;
}

module.exports = {
  calcFinalScore,
  sumScores,
  scoreGoogleTrends,
  calcApiScores,
  apiReqs
}
