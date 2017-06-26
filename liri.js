
// Node file service and request functions
const fs = require('fs');
const request = require('request');

// Keys in their own file
const keys = require('./keys.js');

// Node requests for installed NPM packages
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

// twitter
const twitterClient = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

// omdb
// const ombdClient = new OMDB({


// });

// spotify
const spotifyClient = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});




// Function for Line Item Request Input 
function LineItem(request, input) { // was function Main(command, param)
  
  switch (request) {

    case "my-tweets":
      GetTweets();
    break;

    case "movie-this":
      GetOmdb(input);
    break;

    case "spotify-this-song":
      GetSpotify(input);
    break;

    case "do-what-it-says":
      ReadFile();
    break;

    default:
      console.log("Please Enter a Valid Request.");
  }
}



function GetTweets() {
  twitterClient.get('statuses/user_timeline', (error, tweets, response) => {
    if (error) throw error;
    let logmsg = [];
    for (let i = 0; i < tweets.length; i++) {
      console.log("");
      console.log(tweets[i].text + " @ " + tweets[i].created_at);
      console.log("");
      console.log("---------------");
      console.log("");
      logmsg.push(tweets[i].text + " @ " + tweets[i].created_at);
    }
    LogFile(logmsg);
  });
}



function GetOmdb(movie) {
  if (!movie) {movie = 'Mr. Nobody'};
  request("http://www.omdbapi.com/?apikey=" + keys.omdbKeys.api + "&t=" + movie, {json: true}, (error, response, body) => {
    if (error) throw error;
    console.log("");
    console.log("Title: " + body.Title);
    console.log("Year: " + body.Year);
    console.log("IMDB Rating: " + body.imdbRating);
    console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
    console.log("Country: " + body.Country);
    console.log("Language: " + body.Language);
    console.log("Plot: " + body.Plot);
    console.log("Actors: " + body.Actors);
    console.log("");
    console.log("---------------");
    console.log("");

    let logmsg = [
      "Title: " + body.Title,
      "Year: " + body.Year,
      "IMDB Rating: " + body.imdbRating,
      "Rotten Tomatoes Rating: " + body.Ratings[1].Value,      
      "Country: " + body.Country,
      "Language: " + body.Language,
      "Plot: " + body.Plot,
      "Actors: " + body.Actors,
    ];

    LogFile(logmsg);
  });
}



function GetSpotify(song) {
  if (!song) {song = 'The Sign Ace of Base'};
  spotifyClient.search({ type: 'track', query: song }, (err, data) => {
    if (err) throw err;
    console.log("");
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("");
    console.log("---------------");
    console.log("");

    let logmsg = [
      "Artist: " + data.tracks.items[0].artists[0].name,
      "Song Name: " + data.tracks.items[0].name,
      "Preview Link: " + data.tracks.items[0].preview_url,
      "Album: " + data.tracks.items[0].album.name,
    ];

    LogFile(logmsg);
  });
}



function ReadFile() {
  fs.readFile('random.txt', 'utf8', (err, data) => {
	  if (err) throw err;
    let res = data.split(",");
    if (res[0] === "do-what-it-says") {
      console.log("Doing what random.txt has in the file.");
    } else {
      if (res[1]) {res[1] = res[1].slice(1, res[1].length-1)}
      LineItem(res[0], res[1]);
    }
    LogFile(['Reading command from file...']);
	});
}

function LogFile(logmsg) {
  fs.appendFile('log.txt', '------------\n', (err) => {
    if (err) throw err;
    for (let i = 0; i < logmsg.length; i++) {
      fs.appendFile('log.txt', logmsg[i]+'\n', (err) => {
        if (err) throw err;
      });
    }
  });
}

LineItem(process.argv[2], process.argv[3]);