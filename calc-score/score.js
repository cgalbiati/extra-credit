'use strict';

var apiReqs = require('./api.js');
var Promise = require('bluebird');
var test = require('./test-data');
apiReqs.googleStub = googleStub

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
    console.log('requesting', apiName);
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
      console.log('got scores', scores);
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
function overallScore(apiScoreObj){
  var score = 0;
  for (var api in apiScoreObj){
    //multiply score times weight
    // console.log(api, apiScoreObj[api], apiWeights[api])
    score += apiWeights[api] * apiScoreObj[api];
  }
  if(score > 1) score = 1;
  else if (score < 0) score = 0;
  // console.log('score', score)
  return score;
}

calcApiScores(test.bondSt)
.then(function(apiData){
  console.log(overallScore(apiData))
  return overallScore(apiData);
});

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
  // console.log('twitterData', data)
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
  if(!data.name && data.industry) return 0;

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

  // console.log('awarding google points', indChangePts, recentIndPts, nameChangePts, recentNamePts, oldPoints)
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

function googleStub(){
  console.log('stubing google trends')
  return Promise.resolve(
    {
      name: [ 
        { 'December 2003': '16' },
        { 'January 2004': '16' },
        { 'February 2004': '29' },
        { 'March 2004': '25' },
        { 'April 2004': '32' },
        { 'May 2004': '22' },
        { 'June 2004': '27' },
        { 'July 2004': '32' },
        { 'August 2004': '23' },
        { 'September 2004': '12' },
        { 'October 2004': '12' },
        { 'November 2004': '22' },
        { 'December 2004': '22' },
        { 'January 2005': '24' },
        { 'February 2005': '9' },
        { 'March 2005': '43' },
        { 'April 2005': '19' },
        { 'May 2005': '20' },
        { 'June 2005': '20' },
        { 'July 2005': '41' },
        { 'August 2005': '15' },
        { 'September 2005': '19' },
        { 'October 2005': '16' },
        { 'November 2005': '14' },
        { 'December 2005': '15' },
        { 'January 2006': '25' },
        { 'February 2006': '22' },
        { 'March 2006': '25' },
        { 'April 2006': '12' },
        { 'May 2006': '22' },
        { 'June 2006': '24' },
        { 'July 2006': '15' },
        { 'August 2006': '10' },
        { 'September 2006': '12' },
        { 'October 2006': '16' },
        { 'November 2006': '27' },
        { 'December 2006': '19' },
        { 'January 2007': '14' },
        { 'February 2007': '17' },
        { 'March 2007': '24' },
        { 'April 2007': '13' },
        { 'May 2007': '20' },
        { 'June 2007': '16' },
        { 'July 2007': '16' },
        { 'August 2007': '23' },
        { 'September 2007': '17' },
        { 'October 2007': '30' },
        { 'November 2007': '19' },
        { 'December 2007': '16' },
        { 'January 2008': '16' },
        { 'February 2008': '19' },
        { 'March 2008': '23' },
        { 'April 2008': '14' },
        { 'May 2008': '15' },
        { 'June 2008': '12' },
        { 'July 2008': '25' },
        { 'August 2008': '17' },
        { 'September 2008': '23' },
        { 'October 2008': '17' },
        { 'November 2008': '23' },
        { 'December 2008': '18' },
        { 'January 2009': '22' },
        { 'February 2009': '21' },
        { 'March 2009': '23' },
        { 'April 2009': '21' },
        { 'May 2009': '15' },
        { 'June 2009': '19' },
        { 'July 2009': '16' },
        { 'August 2009': '19' },
        { 'September 2009': '19' },
        { 'October 2009': '29' },
        { 'November 2009': '18' },
        { 'December 2009': '20' },
        { 'January 2010': '24' },
        { 'February 2010': '23' },
        { 'March 2010': '27' },
        { 'April 2010': '29' },
        { 'May 2010': '21' },
        { 'June 2010': '18' },
        { 'July 2010': '18' },
        { 'August 2010': '18' },
        { 'September 2010': '18' },
        { 'October 2010': '21' },
        { 'November 2010': '23' },
        { 'December 2010': '22' },
        { 'January 2011': '18' },
        { 'February 2011': '100' },
        { 'March 2011': '24' },
        { 'April 2011': '25' },
        { 'May 2011': '29' },
        { 'June 2011': '25' },
        { 'July 2011': '30' },
        { 'August 2011': '31' },
        { 'September 2011': '30' },
        { 'October 2011': '45' },
        { 'November 2011': '35' },
        { 'December 2011': '38' },
        { 'January 2012': '39' },
        { 'February 2012': '35' },
        { 'March 2012': '39' },
        { 'April 2012': '31' },
        { 'May 2012': '32' },
        { 'June 2012': '33' },
        { 'July 2012': '42' },
        { 'August 2012': '38' },
        { 'September 2012': '34' },
        { 'October 2012': '27' },
        { 'November 2012': '32' },
        { 'December 2012': '32' },
        { 'January 2013': '35' },
        { 'February 2013': '37' },
        { 'March 2013': '43' },
        { 'April 2013': '39' },
        { 'May 2013': '39' },
        { 'June 2013': '43' },
        { 'July 2013': '37' },
        { 'August 2013': '48' },
        { 'September 2013': '51' },
        { 'October 2013': '52' },
        { 'November 2013': '42' },
        { 'December 2013': '50' },
        { 'January 2014': '50' },
        { 'February 2014': '49' },
        { 'March 2014': '56' },
        { 'April 2014': '41' },
        { 'May 2014': '40' },
        { 'June 2014': '45' },
        { 'July 2014': '40' },
        { 'August 2014': '44' },
        { 'September 2014': '42' },
        { 'October 2014': '47' },
        { 'November 2014': '43' },
        { 'December 2014': '45' },
        { 'January 2015': '41' },
        { 'February 2015': '50' },
        { 'March 2015': '45' },
        { 'April 2015': '46' },
        { 'May 2015': '48' },
        { 'June 2015': '44' },
        { 'July 2015': '49' },
        { 'August 2015': '48' },
        { 'September 2015': '49' },
        { 'October 2015': '46' },
        { 'November 2015': '43' },
        { 'December 2015': '46' },
        { 'January 2016': '47' },
        { 'February 2016': '49' },
        { 'March 2016': '51' } 
      ],
      industry: [ 
        { 'December 2003': '62' },
        { 'January 2004': '70' },
        { 'February 2004': '66' },
        { 'March 2004': '67' },
        { 'April 2004': '60' },
        { 'May 2004': '66' },
        { 'June 2004': '64' },
        { 'July 2004': '63' },
        { 'August 2004': '62' },
        { 'September 2004': '59' },
        { 'October 2004': '61' },
        { 'November 2004': '59' },
        { 'December 2004': '62' },
        { 'January 2005': '66' },
        { 'February 2005': '59' },
        { 'March 2005': '60' },
        { 'April 2005': '63' },
        { 'May 2005': '66' },
        { 'June 2005': '63' },
        { 'July 2005': '61' },
        { 'August 2005': '66' },
        { 'September 2005': '67' },
        { 'October 2005': '67' },
        { 'November 2005': '54' },
        { 'December 2005': '50' },
        { 'January 2006': '52' },
        { 'February 2006': '56' },
        { 'March 2006': '54' },
        { 'April 2006': '57' },
        { 'May 2006': '57' },
        { 'June 2006': '54' },
        { 'July 2006': '55' },
        { 'August 2006': '56' },
        { 'September 2006': '58' },
        { 'October 2006': '57' },
        { 'November 2006': '57' },
        { 'December 2006': '54' },
        { 'January 2007': '54' },
        { 'February 2007': '54' },
        { 'March 2007': '55' },
        { 'April 2007': '65' },
        { 'May 2007': '63' },
        { 'June 2007': '53' },
        { 'July 2007': '53' },
        { 'August 2007': '50' },
        { 'September 2007': '48' },
        { 'October 2007': '46' },
        { 'November 2007': '41' },
        { 'December 2007': '41' },
        { 'January 2008': '39' },
        { 'February 2008': '39' },
        { 'March 2008': '40' },
        { 'April 2008': '40' },
        { 'May 2008': '40' },
        { 'June 2008': '41' },
        { 'July 2008': '39' },
        { 'August 2008': '42' },
        { 'September 2008': '43' },
        { 'October 2008': '41' },
        { 'November 2008': '40' },
        { 'December 2008': '44' },
        { 'January 2009': '52' },
        { 'February 2009': '50' },
        { 'March 2009': '50' },
        { 'April 2009': '61' },
        { 'May 2009': '70' },
        { 'June 2009': '61' },
        { 'July 2009': '64' },
        { 'August 2009': '70' },
        { 'September 2009': '66' },
        { 'October 2009': '81' },
        { 'November 2009': '85' },
        { 'December 2009': '83' },
        { 'January 2010': '90' },
        { 'February 2010': '100' },
        { 'March 2010': '96' },
        { 'April 2010': '89' },
        { 'May 2010': '81' },
        { 'June 2010': '62' },
        { 'July 2010': '61' },
        { 'August 2010': '65' },
        { 'September 2010': '56' },
        { 'October 2010': '48' },
        { 'November 2010': '43' },
        { 'December 2010': '41' },
        { 'January 2011': '46' },
        { 'February 2011': '45' },
        { 'March 2011': '45' },
        { 'April 2011': '43' },
        { 'May 2011': '49' },
        { 'June 2011': '46' },
        { 'July 2011': '50' },
        { 'August 2011': '51' },
        { 'September 2011': '54' },
        { 'October 2011': '54' },
        { 'November 2011': '47' },
        { 'December 2011': '47' },
        { 'January 2012': '51' },
        { 'February 2012': '51' },
        { 'March 2012': '64' },
        { 'April 2012': '76' },
        { 'May 2012': '74' },
        { 'June 2012': '72' },
        { 'July 2012': '76' },
        { 'August 2012': '83' },
        { 'September 2012': '88' },
        { 'October 2012': '86' },
        { 'November 2012': '83' },
        { 'December 2012': '72' },
        { 'January 2013': '65' },
        { 'February 2013': '62' },
        { 'March 2013': '61' },
        { 'April 2013': '46' },
        { 'May 2013': '41' },
        { 'June 2013': '39' },
        { 'July 2013': '36' },
        { 'August 2013': '40' },
        { 'September 2013': '41' },
        { 'October 2013': '39' },
        { 'November 2013': '35' },
        { 'December 2013': '37' },
        { 'January 2014': '39' },
        { 'February 2014': '52' },
        { 'March 2014': '40' },
        { 'April 2014': '39' },
        { 'May 2014': '38' },
        { 'June 2014': '37' },
        { 'July 2014': '37' },
        { 'August 2014': '42' },
        { 'September 2014': '41' },
        { 'October 2014': '41' },
        { 'November 2014': '38' },
        { 'December 2014': '41' },
        { 'January 2015': '40' },
        { 'February 2015': '40' },
        { 'March 2015': '39' },
        { 'April 2015': '38' },
        { 'May 2015': '41' },
        { 'June 2015': '40' },
        { 'July 2015': '36' },
        { 'August 2015': '41' },
        { 'September 2015': '42' },
        { 'October 2015': '43' },
        { 'November 2015': '41' },
        { 'December 2015': '40' },
        { 'January 2016': '43' },
        { 'February 2016': '41' },
        { 'March 2016': '48' } 
      ] 
    }
  );
}
