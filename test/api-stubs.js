'use strict';

//this contains sample responses for each API 
//at the bottom are functions that return the data
//it is a very long file

var yelpData = { rating: 4,
  rating_img_url: 'https://s3-media4.fl.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png',
  display_phone: '+1-303-444-5953',
  gift_certificates:
   [ { url: 'http://www.yelp.com/gift-certificates/pekoe-sip-house-boulder?utm_campaign=yelp_api&utm_medium=api_v2_phone_search&utm_source=UOuBZtnSBG9A-nKUAYp-Iw',
       unused_balances: 'CREDIT',
       options: [Object],
       image_url: 'http://s3-media4.fl.yelpcdn.com/bphoto/J0E0czDvGHulhHCiKn1wbQ/m.jpg',
       id: 'eyPOTlQUaXIYrjtsGH0i1w',
       currency_code: 'USD' } ],
  id: 'pekoe-sip-house-boulder',
  is_closed: false,
  mobile_url: 'http://m.yelp.com/biz/pekoe-sip-house-boulder?utm_campaign=yelp_api&utm_medium=api_v2_phone_search&utm_source=UOuBZtnSBG9A-nKUAYp-Iw',
  review_count: 52,
  snippet_image_url: 'http://s3-media4.fl.yelpcdn.com/photo/O80my0hNEJdHDf_z_UCEOg/ms.jpg',
  location:
   { city: 'Boulder',
     display_address: [ '1225 Alpine Ave', 'Boulder, CO 80304' ],
     geo_accuracy: 8,
     postal_code: '80304',
     country_code: 'US',
     address: [ '1225 Alpine Ave' ],
     coordinate: { latitude: 40.0256423, longitude: -105.2815833 },
     state_code: 'CO' },
  is_claimed: true,
  rating_img_url_small: 'https://s3-media4.fl.yelpcdn.com/assets/2/www/img/f62a5be2f902/ico/stars/v1/stars_small_4.png',
  phone: '+13034445953',
  snippet_text: 'Wonderful little tea place. Typically pretty busy too. The bartistas are talented and friendly. Try their spicy green chai...yummmm. Lots of regulars who...',
  rating_img_url_large: 'https://s3-media2.fl.yelpcdn.com/assets/2/www/img/ccf2b76faa2c/ico/stars/v1/stars_large_4.png',
  categories:
   [ [ 'Coffee & Tea', 'coffee' ],
     [ 'Cafes', 'cafes' ],
     [ 'Bubble Tea', 'bubbletea' ] ],
  name: 'Pekoe Sip House',
  url: 'http://www.yelp.com/biz/pekoe-sip-house-boulder?utm_campaign=yelp_api&utm_medium=api_v2_phone_search&utm_source=UOuBZtnSBG9A-nKUAYp-Iw',
  deals:
   [ { what_you_get: 'You get a voucher redeemable for $25 at Pekoe Sip House.\nPrint out your voucher, or redeem on your phone with the <a href="http://www.yelp.com/mobile?source=deal_marketing">Yelp app</a>.',
       time_start: 1454525169,
       title: '$20 for $25',
       url: 'http://www.yelp.com/deals/pekoe-sip-house-boulder-3?utm_campaign=yelp_api&utm_medium=api_v2_phone_search&utm_source=UOuBZtnSBG9A-nKUAYp-Iw',
       additional_restrictions: 'Promotion lasts for 1 year from date of purchase. After that period, your voucher is redeemable for the amount you paid, less any value you may have received. Not valid with other vouchers, certificates, or offers. Only 1 voucher(s) can be purchased and redeemed per person. Up to 1 can be purchased as gifts for others. Subject to the <a target="_blank" href="http://www.yelp.com/tos/general_b2c_us_20120911">General Terms</a>.',
       options: [Object],
       image_url: 'https://s3-media1.fl.yelpcdn.com/dphoto/yoxNMCnu_zBjukslmNzLTQ/m.jpg',
       id: 'FFaDlJVzHucFfvI1GOa-ew',
       currency_code: 'USD' } ],
  image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/htzgoyKOo3ETDhCFpeaQvw/ms.jpg',
  menu_provider: 'single_platform',
  menu_date_updated: 1442317588 
};

var twitterData = { 
  pos:
   { statuses: [ ['hi'], ['hi'], ['hi'], ['hi'], ['hi'] ],
     search_metadata:
      { completed_in: 0.025,
        max_id: 721683325836918800,
        max_id_str: '721683325836918786',
        query: '%40PekoeSipHouse+%3A%29',
        refresh_url: '?since_id=721683325836918786&q=%40PekoeSipHouse%20%3A%29&include_entities=1',
        count: 15,
        since_id: 0,
        since_id_str: '0' } },
  neg:
   { statuses: [['hi']],
     search_metadata:
      { completed_in: 0.063,
        max_id: 722942545555161100,
        max_id_str: '722942545555161088',
        query: '%40PekoeSipHouse+%3A%28',
        refresh_url: '?since_id=722942545555161088&q=%40PekoeSipHouse%20%3A%28&include_entities=1',
        count: 15,
        since_id: 0,
        since_id_str: '0' } },
  all:
   { statuses: [ ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'], ['hi'] ],
     search_metadata:
      { completed_in: 0.034,
        max_id: 721683325836918800,
        max_id_str: '721683325836918786',
        query: '%40PekoeSipHouse',
        refresh_url: '?since_id=721683325836918786&q=%40PekoeSipHouse&include_entities=1',
        count: 15,
        since_id: 0,
        since_id_str: '0' } 
    } 
};

var googleData = {
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

var glassdoorData = {
  id: 825779,
  name: 'Bond Street',
  website: 'www.onbondstreet.com',
  isEEP: false,
  exactMatch: true,
  industry: 'Lending',
  numberOfRatings: 5,
  squareLogo: '',
  overallRating: 5,
  ratingDescription: 'Very Satisfied',
  cultureAndValuesRating: '0.0',
  seniorLeadershipRating: '0.0',
  compensationAndBenefitsRating: '0.0',
  careerOpportunitiesRating: '0.0',
  workLifeBalanceRating: '0.0',
  recommendToFriendRating: '0.0',
  sectorId: 10010,
  sectorName: 'Finance',
  industryId: 200054,
  industryName: 'Lending',
  featuredReview:
   { attributionURL: 'http://www.glassdoor.com/Reviews/Employee-Review-Bond-Street-RVW8444397.htm',
     id: 8444397,
     currentJob: true,
     reviewDateTime: '2015-10-27 06:43:47.913',
     jobTitle: 'Employee',
     location: 'New York, NY',
     headline: 'Growing Company with a Great Culture',
     pros: 'Bond Street\'s team is absolutely top notch. Everyone is extremely smart, motivated and fun to work with. \r\n\r\nSenior leaders are very accessible and thoughtful. They\'re also particularly good at continually evaluating company processes and keeping things as efficient as possible. David (the CEO) is fantastic at communicating the vision and setting ambitious goals for the company.',
     cons: 'The office environment is high energy and can be slightly noisy at times. Like most offices, a good pair of over ear headphones is very helpful to have.',
     overall: 5,
     overallNumeric: 5 },
  ceo:
   { name: 'David Haber',
     title: 'CEO and Co-Founder',
     numberOfRatings: 0,
     pctApprove: 0,
     pctDisapprove: 0 } 
};

//returns sample google trends data
function googleStub(){
  return Promise.resolve(googleData);
}
//returns sample twitter data
function twitterStub(){
  return Promise.resolve(twitterData);
}
//returns sample yelp data
function yelpStub(){
  return Promise.resolve(yelpData);
}
//returns sample glassdoor data
function glassdoorStub(){
  return Promise.resolve(glassdoorData);
}

module.exports = {
  yelpSearch: yelpStub,
  twitter: twitterStub,
  glassdoor: glassdoorStub,
  googleSearchTrends: googleStub,
};