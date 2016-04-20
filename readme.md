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

### Running the program
```sh
$ npm start
```

### Running Tests
```sh
$ npm test
```

### Tech
In addition to the APIs, Extra Credit uses several open source libraries
* [Bluebird] - Awesome promise library
* [OAuth] - OAuth library
* [Request-Promise] - Promisified requests
* [Express] - fast node.js network app framework [@tjholowaychuk]


### Reasoning behind some decisions

**Yelp:**
> I factored both the number of reviews, and the overall rating of a business into its score, with the reasoning that having a large number of reviews indicates a large customer base, and having good reviews suggests that the business is doing a good job, and that customers are likely to return.  (Though in reality this can be taken with a grain of salt, because Yelp is apparently not completely trustworthy regarding corruption)

**Glassdoor:**
>  Similarly to Yelp, if employees are reviewing a business positively, it likely means the business is well-managed.  In this case I factored in the score, but not the number of reviews.

**Twitter:**
> In addition to reviews, I attempted to assess the overall notariety of a business. (Are people talking about it?)

**Google Trends:**

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

### Version
3.2.7

### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [Marked] - a super fast port of Markdown to JavaScript
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [keymaster.js] - awesome keyboard handler lib by [@thomasfuchs]
* [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

You need Gulp installed globally:

```sh
$ npm i -g gulp
```

```sh
$ git clone [git-repo-url] dillinger
$ cd dillinger
$ npm i -d
$ gulp build --prod
$ NODE_ENV=production node app
```

### Plugins

Dillinger is currently extended with the following plugins

* Dropbox
* Github
* Google Drive
* OneDrive

Readmes, how to use them in your own application can be found here:

* [plugins/dropbox/README.md] [PlDb]
* [plugins/github/README.md] [PlGh]
* [plugins/googledrive/README.md] [PlGd]
* [plugins/onedrive/README.md] [PlOd]

### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma start
```

### Docker
Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 80, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image. 

```sh
cd dillinger
docker build -t <youruser>/dillinger:latest .
```
This will create the dillinger image and pull in the necessary dependencies. Once done, run the Docker and map the port to whatever you wish on your host. In this example, we simply map port 80 of the host to port 80 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 80:80 --restart="always" <youruser>/dillinger:latest
```

Verify the deployment by navigating to your server address in your preferred browser.

### N|Solid and NGINX

More details coming soon.

#### docker-compose.yml

Change the path for the nginx conf mounting path to your full path, not mine!

### Todos

 - Write Tests
 - Rethink Github Save
 - Add Code Comments
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [yelp]: <http://www.yelp.com/developers/documentation/v2/search_api>
   [node-yelp]: <https://github.com/olalonde/node-yelp>
   [twitter]: <https://dev.twitter.com/rest/reference/get/search/tweets>
   [glassdoor]: <https://www.glassdoor.com/developer/index.htm>
   [google-trends]: <https://www.npmjs.com/package/google-trends-api>
   [node]: <https://docs.npmjs.com/getting-started/installing-node>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [marked]: <https://github.com/chjj/marked>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [keymaster.js]: <https://github.com/madrobby/keymaster>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]:  <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>

