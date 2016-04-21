# Readme

Extra Credit attempts to use notariety to assess a business with the thought that if people are talking about a business, and if its customers and employees are happy, it is probably on a good trajectory.  I use several APIs to gather data about reviews and web activity related to a business.

### APIs used:
  - [Yelp][yelp]  
  - [Google Trends][google-trends]
  - [Glassdoor][glassdoor] 
  - [Twitter][twitter]

### Installation
You need Node and npm. If you don't have these, see how [here][node].

```sh
$ git clone [git-repo-url] extra-credit
$ cd extra-credit
$ npm install
```

The program uses several APIs that require authentification.  Normally, I would set up my keys and secrets as environment variables.  However, to ensure ease of use, I have put them into a file (env-variables), and used those variables instead.


### Running the program
Input business data using the command line:
```sh
$ npm start
```
or see a demo using test-data:

* Note, this file has a built in wait time of 12-24 seconds between samples in order to attempt avoiding Google's bot detection.  If you are seeing the error "error getting Google Trends data Cannot read property 'reduce' of null" or "limit exceeded" it means you got temporarilly blocked and the Google Trends scores will be 0.
```sh
$ node demo.js
```


### Testing
```sh
$ npm test
```
These are meant to be a sample, not a complete testing suite.

### Thoughts behind some decisions

In several of the scoring algorithms, I gave more points for more of something like reviews or tweets, with the hypothesis that this meant more customers and therefore a more stable business.  However, I instituted a cap, after which it would max out at the full possible score.  I did this partially to differentiate more between the lower values (I could have instituted a log scale instead to do this), and partially because at some point enough is enough.  

I also let several of the scoring functions max out without getting full points on both of several criteria (ex, name and industry in Google Trends) with the hypothesis that an extra high score in one, should offset the other.

This 'more is better' aproach gives large advantages to businesses in urban settings and with younger consumer bases, as does the entire premise of digital notoriety.

**Yelp:**
> I factored both the number of reviews, and the overall rating of a business into its score, with the reasoning that having a large number of reviews indicates a large customer base, and having good reviews suggests that the business is doing a good job, and that customers are likely to return.  (Though in reality this can be taken with a grain of salt, because Yelp is apparently not completely trustworthy regarding corruption)

**Glassdoor:**
>  Similarly to Yelp, if employees are reviewing a business positively, it likely means the business is well-managed.  In this case I factored in the score, but not the number of reviews.

**Twitter:**
> In addition to reviews, I attempted to assess the overall notariety of a business. (Are people talking about it?) Twitter offers (questionably accurate based on testing) sentiment analysis, so in addition to counting the number of tweets, I weighted the results by the percentage of positive vs negative tweets.  Allegedly, Twitter only searches a subset of all data, and I did notice that some searches came up empty when there should have been results, so this might explain it. 

**Google Trends:**
> I awarded points for number of recent searches (in the last year) for a business name, having searches for a business name 3 years ago, and for an increase in searches about the business name or industry over the last 3 years, with the idea that searches could mean the business is popular or industry is booming, and increasing searches mean it is growing more popular.

***Other thoughts***
> After looking at some sample data, I'm not convinced this algorithm is particularly helpful.  For example, the Recrurse Center does not have any yelp reviews (possibly due to the fact that everyday customers (participants) do not pay to attend, and because it relies much more on community and word-of-mouth than on more traditional advertising.  Similarly, Bond Street does not appear to have a Yelp page, possibly for similar reasons of a alternatve model of community vs 'customers'.  Both of these businesses, however, seem stable and have happy 'customer' bases.  If my algorithm looked into more factors, it would probably be more able to overcome missing or bad data in a single area.

***Next Steps***
> I wanted to analyze data about the cities and industries of businesses using government census data. (ex: is the anual average revinue in the city or industry rising from year to year, how much is the average rent, is there violence or economic/political instability in the area...)


  [yelp]: <http://www.yelp.com/developers/documentation/v2/search_api>
   [node-yelp]: <https://github.com/olalonde/node-yelp>
   [twitter]: <https://dev.twitter.com/rest/reference/get/search/tweets>
   [glassdoor]: <https://www.glassdoor.com/developer/index.htm>
   [google-trends]: <https://www.npmjs.com/package/google-trends-api>
   [node]: <https://docs.npmjs.com/getting-started/installing-node>s