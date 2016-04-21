var OAuth = require('OAuth');
var rp = require('request-promise');
var Yelp = require('yelp');
var googleTrends = require('google-trends-api');
var Promise = require('bluebird');

//replacing process.env variables for ease of use for you
//normally, I would keep these keys as env variables
var env = require('../env-variables');

//API keys and secrets
var TWITTER_KEY = env.TWITTER_KEY;
var TWITTER_SECRET = env.TWITTER_SECRET;
var TWITTER_TOKEN = env.TWITTER_TOKEN;
var TWITTER_TOKEN_SECRET = env.TWITTER_TOKEN_SECRET;

var YELP_KEY = env.YELP_KEY;
var YELP_SECRET = env.YELP_SECRET;
var YELP_TOKEN = env.YELP_TOKEN;
var YELP_TOKEN_SECRET = env.YELP_TOKEN_SECRET;

var GD_KEY=env.GD_KEY;
var GD_PARTNER_ID = env.GD_PARTNER_ID;

var SPACE_RE = /\s/g;

//returns name and city with spaces replaced by dashes
//params has keys name and location
function replaceSpace(str, replaceChar){
  return str.replace(SPACE_RE, replaceChar);
}

//instantiate yelp api object
// yelp has methods that search businesses (ex: yelp.search(), yelp.business())
// See http://www.yelp.com/developers/documentation/v2/search_api and https://github.com/olalonde/node-yelp
var yelp = new Yelp({
  consumer_key: YELP_KEY,
  consumer_secret: YELP_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET,
});

//returns business info or undefined of not found in yelp
//params is {name, phone, address}
function yelpSearch(params){
  console.log(params)
  //TODO: compare name/website/location to verify correct business
  var results;
  //serach by phone if available
  if (params.phone) results = yelp.phoneSearch({phone: params.phone}); 
  else {
    results = yelp.search({term: params.name, location: params.location.city});
  }
  
  return results.then(function(data){
    //data contains meta info and an array of bunsinesses
    //verify business using address
    var found;
    data.businesses.some(function(business, idx){
      //TODO: determine if similar address and name
      if(business.location.address[0] === params.location.address) {
        found = business;
        return true;
      }
    });
    return found;
  })
  .catch(function(err){
    console.error('error getting Yelp data', err.message);
  });
}

//instrantiate twitter OAuth object
var twitterOauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_KEY,
  TWITTER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

//searches twitter for positive and negative tweets @ (or including if no twitter handle) business name
//params object must inlcude name key
//see https://dev.twitter.com/rest/reference/get/search/tweets
function twitter(params){
  //TODO: analyze tweets from user account - consistancy, retweets, etc?

  //build url using params
  var name;
  if (params.twitter) name = '%40' + encodeURI(params.twitter);
  //if no twitter, use business name as exact phrase
  else name = '%22' + encodeURI(params.name) + '%22';

  var baseUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=' +  name;
  //twitter's api includes sentiment analysis for negative and positive attitudes
  var happyUrl = baseUrl + '%20%3A%29';
  var sadUrl = baseUrl + '%20%3A%28';

  return Promise.map([happyUrl, sadUrl, baseUrl], function(url){
    return twitterReq(url);
  })
  .then(function(data){ 
    return {pos: data[0], neg: data[1], all: data[2]};
  })
  .catch(function(err){
    console.error('error processing twitter data', err.message);
  });
}

//returns promise for twitter data for a given url
function twitterReq(url){
  return new Promise(function(fulfill, reject){
    twitterOauth.get(
      url,
      TWITTER_TOKEN,
      TWITTER_TOKEN_SECRET,
      function (error, data, response){
        try {
          data = JSON.parse(data);
          fulfill(data);
        } catch (err) {
          console.error('error getting Twitter data', error);
          // reject(err);
        }
      }, reject);
    });
}

//see https://www.glassdoor.com/developer/index.htm
//params should be an object containing name, location, and website(if applicable)
function glassdoor(params){

  //build query string
  var name = replaceSpace(params.name, '-');
  var city = replaceSpace(params.location.city, '-');

  var queryString = '&q=' + name + '&city=' + city;
  if (params.location.state) queryString += '&state=' + params.location.state;
  queryString += '&country=' + params.location.country;

  //build api url with auth
  //these don't have to be accurate
  var userAgent = 'Mozilla/%2F4.0';
  var ip = '88.192.249.8';

  var url = 'http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p='+GD_PARTNER_ID+'&t.k='+GD_KEY+'&action=employers&'+queryString+'&userip='+ip+'&useragent='+userAgent;

  var options = {
    uri: url,
    headers: {
        'User-Agent': userAgent
    },
    json: true // Automatically parses the JSON string in the response 
  };
  return rp(options)
  .then(function(res){
    //res has key employers (and others with metadata)

    var foundBusiness = null;  

    //if one business is found return it if website matches or no site
    if (res.response.employers && res.response.employers.length === 1) {
      if (params.website) {
        //if website matches return employer
        if (res.response.employers[0].website.includes(params.website)) foundBusiness = res.response.employers[0];
      } 
      //if no website, return the one found
      else foundBusiness = res.response.employers[0];
    }

    // if more than one found, filter for website or return null
    //TODO: any other ways of filtering?? (no address or phone)
    else if (params.website){
      res.response.employers.some(function(business){
        if (business.website.includes(params.website)){
          foundBusiness = business;
          return true;
        }
      });
    }
    
    //return found business (or null)
    return Promise.resolve(foundBusiness);
  })
  .catch(function(err){
    console.error('error getting GlassDoor data', err.message);
  });
}

// returns historic trend data for the name and industry
// results are in the form of an object with keys name and industry, with arrays of month/year: score.  
// ex: name: [ { 'January 2006': '10' },{ 'February 2006': '26' }]
// see https://www.npmjs.com/package/google-trends-api
function googleSearchTrends(name, industry){
  return googleTrends.trendData([name, industry])
    .then(function(results){
      return {name: results[0], industry: results[1]};
    })
    .catch(function(err){
      console.error("error getting Google Trends data", err.message);
      //returning empty data in case request gets blocked
      return {err: err.message};
    });
}

//export api search functions
module.exports = {
  twitter,
  yelpSearch,
  glassdoor,
  googleSearchTrends
}
