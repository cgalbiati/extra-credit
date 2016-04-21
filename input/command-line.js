'use strict';

var inputChoices = require('./input-choices');

//array of country names and iso codes to error check against
//phone codes is a dictionary of iso codes to phone codes
var countryNamePoss = Object.keys(inputChoices.countryNameToIsoCode).concat(Object.keys(inputChoices.phoneCodes));

//for removing symbols from phone numbers
var NON_DIGIT_RE = /\D/g;

//used to allow stubbing in tests
var input = {
  promptAndInput,
  getPoss,
  getBusinessInfo,
}

//prompt + stdin data return wrapped in a promise to allow chaining
//returns promise for data (string)
function promptAndInput(message){
  var returnData;
  return new Promise(function(fulfill, reject){
    process.stdout.write(message);
    process.stdin.once('data', function(data) {
      returnData = data.toString().trim(); 
      fulfill(returnData);
    });
  });
}

//prompts user for something based on message
//only accepts answers in choices array
//returns a promise for a string
function getPoss(message, choicesArr, errMessage){
  return input.promptAndInput(message)
  .then(function(resp){
    if (!choicesArr.some(function(choice){
      return choice === resp;
    })) {
      console.log(errMessage);
      return input.promptAndInput('Would you like to see possible choices? (y/n')
        .then(function(answer){
          if (answer === 'y' || answer === 'Y') console.log(choicesArr);
          //recursively call function to allow user to try again
          return input.getPoss(message, choicesArr, errMessage);
        });
    } else return resp;
  });
}

//builds business data object from user inputs
//returns business object in shape that score functions require
function getBusinessInfo(){
  var business = {location:{}};

  return input.promptAndInput('Enter business name followed by enter: ')
    .then(function(name){
      business.name = name;
      return input.promptAndInput('Enter business street address (do not include floor, apt or room number) ');
    })
    .then(function(address){
      business.location.address = address;
      return input.getPoss('Enter country name or ISO code *Please capitalize country name/ISO code or it will not be accepted* ', countryNamePoss, 'Sorry, that is not a valid country.  Please check your capitalization and spelling.');
    })
    .then(function(country){
      if (inputChoices.countryNameToIsoCode[country]) business.location.country = inputChoices.countryNameToIsoCode[country] ;     
      else if (inputChoices.phoneCodes[country]) business.location.country = country;

      //get state if in US
      if (business.location.country === 'US') {
        return input.getPoss('Enter state abreviation (Please capitalize) ', inputChoices.stateAbrevs, 'Sorry, that is not a valid state abreviation.  Please try again.')
          .then(function(state){
            business.location.state = state;
            return input.promptAndInput('Enter business city: ');
          });
        }
      else return input.promptAndInput('Enter business city: ');
    })
    .then(function(city){
      business.location.city = city;
      return input.promptAndInput('Enter local phone number (including area code but not country code) ');
    })
    .then(function(phone){
      var countryPrefix = inputChoices.phoneCodes[business.location.country];
      if (phone.length) business.phone = countryPrefix + phone.replace(NON_DIGIT_RE, '');
      return input.promptAndInput('Enter business industry: ');
    })
    .then(function(industry){
      business.industry = industry;
      return input.promptAndInput('Enter business website. (Do not include http or www, etc) If there is no website, just press enter ');
    })
    .then(function(website){
      business.website = website;
      return input.promptAndInput('Enter business twitter handle. (Do not include @) If there is no handle, just press enter ');
    })
    .then(function(twitter){
      business.twitter = twitter;
      console.log('Thank you :)')
      return Promise.resolve(business);
    });
}


module.exports = input;