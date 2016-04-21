var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var sampleData = require('./test-data');
var inputFns = require('../input/command-line.js');
var scoreFns = require('../calc-score/score.js');
//api functions are all stubbed
var apiReqs = require('./api-stubs');

var getPoss = inputFns.getPoss;
var promptAndInput = inputFns.promptAndInput;
var getBusinessInfo = inputFns.getBusinessInfo;

function promWrapper(returnVal){
  return Promise.resolve(returnVal);
}

describe('getting business info', function(){
  beforeEach(function(){
    promptAndInput = sinon.stub(inputFns, 'promptAndInput');
    getPoss = sinon.spy(inputFns, 'getPoss');
  });
  afterEach(function(){
      promptAndInput.restore();
      getPoss.restore();
  });

  it('should not allow invalid selections for country', function(){

    promptAndInput.onCall(0).returns(promWrapper('Caps for sale'));
    promptAndInput.onCall(1).returns(promWrapper('244 Moose Way'));
    promptAndInput.onCall(2).returns(promWrapper('Canadia'));
    promptAndInput.onCall(3).returns(promWrapper('n'));
    promptAndInput.onCall(4).returns(promWrapper('Mooseville'));
    promptAndInput.onCall(5).returns(promWrapper('n'));
    promptAndInput.onCall(6).returns(promWrapper('CAN'));
    promptAndInput.onCall(7).returns(promWrapper('n'));
    promptAndInput.onCall(8).returns(promWrapper('That cold place'));
    promptAndInput.onCall(9).returns(promWrapper('n'));
    promptAndInput.onCall(10).returns(promWrapper('Canada'));
    promptAndInput.onCall(11).returns(promWrapper('Mooseville'));
    promptAndInput.onCall(12).returns(promWrapper('(666)555-4321'));
    promptAndInput.onCall(13).returns(promWrapper('Monkey friends'));
    promptAndInput.onCall(14).returns(promWrapper('givemebackmycaps.com'));
    promptAndInput.onCall(15).returns(promWrapper('youmonkeysyou'));

    return getBusinessInfo()
      .then(function(busObj){
        expect(busObj.location.country).to.equal('CA'); 
        expect(getPoss.callCount).to.equal(5);
      });
  });
  it('should return correct info', function(){
    
    promptAndInput.onCall(0).returns(promWrapper('Caps for sale'));
    promptAndInput.onCall(1).returns(promWrapper('244 Moose Way'));
    promptAndInput.onCall(2).returns(promWrapper('Canada'));
    promptAndInput.onCall(3).returns(promWrapper('Mooseville'));
    promptAndInput.onCall(4).returns(promWrapper('(666)555-4321'));
    promptAndInput.onCall(5).returns(promWrapper('Monkey friends'));
    promptAndInput.onCall(6).returns(promWrapper('givemebackmycaps.com'));
    promptAndInput.onCall(7).returns(promWrapper('youmonkeysyou'));

    return getBusinessInfo()
      .then(function(busObj){
        expect(busObj.name).to.equal('Caps for sale'); 
      });
  });
  it('should transform phone numbers to correct format', function(){
    promptAndInput.onCall(0).returns(promWrapper('Caps for sale'));
    promptAndInput.onCall(1).returns(promWrapper('244 Moose Way'));
    promptAndInput.onCall(2).returns(promWrapper('Canada'));
    promptAndInput.onCall(3).returns(promWrapper('Mooseville'));
    promptAndInput.onCall(4).returns(promWrapper('(666)555-4321'));
    promptAndInput.onCall(5).returns(promWrapper('Monkey friends'));
    promptAndInput.onCall(6).returns(promWrapper('givemebackmycaps.com'));
    promptAndInput.onCall(7).returns(promWrapper('youmonkeysyou'));

    return getBusinessInfo()
      .then(function(busObj){
        expect(busObj.phone).to.equal('+16665554321'); 
      });
  });
});

describe('scoring google trends', function(){
  it('should correctly calculate score based on trends info', function(){
    
    return apiReqs.googleSearchTrends(sampleData.pekoe).then(function(data){
      var score = scoreFns.scoreGoogleTrends(data);
      expect(score).to.equal(0.17047852004524314);
    });
  });
});

describe('calculating overall score', function(){

  it('should correctly calculate total score', function(){
    var scores = {
      yelpSearch: 0.5,
      twitter: 0.5,
      glassdoor: 0.5,
      googleSearchTrends: 0.5
    };
    var total = scoreFns.sumScores(scores);
    expect(total).to.equal(0.8500000000000001);
  });
});




