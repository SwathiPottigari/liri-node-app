require('dotenv').config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var title = "";


var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

function decideMethod(method, query) {
    switch (method) {
        case "concert-this":
            callBandsintownAPI(query);
            break;
        case "spotify-this-song":
            callSpotifyAPI(query);
            break;
        case "movie-this":
            callOMDBapi(query);
            break;
        case "do-what-it-says":
            callTextFile();
            break;
        default:
            console.log("Invalid command");
    }

}


function callBandsintownAPI(artist) {

    var artistUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(artistUrl).then(function (res) {
        var response = res.data;
        title = "\nThe List of the events for Artist\n";
        var data = "";
        response.forEach(function (element) {
            data += element.venue.name + " at " + element.venue.city + "," + element.venue.region + " " + element.venue.country + " on " + moment(element.datetime).format("MM/DD/YYYY") + ' \n';
        });
        console.log(title + "\n" + data);
        logDataInFile(title + "\n" + data);
    });
};


function callSpotifyAPI(query) {

    spotify.search({ type: "track", query: query }, function (err, res) {
        if (err) {
            return console.log(err);
        }
        var response = res.tracks.items;
        title = "The List of Songs";
        var data = "";
        response.forEach(function (element) {
            data += " " + "\nArtists - " + element.album.artists[0].name + "\nSong - " + element.name + "\nPreview - " + element.preview_url + "\nAlbum - " + element.album.name + " \n---------------------------------------\n";
        });
        console.log(title + "\n" + data);
        logDataInFile(title + "\n" + data);

    });
};

function callOMDBapi(title) {
    if (title === "") {
        title = "Mr.Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy").then(function (response) {
        title = "The movie details are below";
        var data = "\nTitle - " + response.data.Title + "\nYear - " + response.data.Year + "\nIMDB Rating - " + response.data.Ratings[0].Value + "\nRotten Tomatoes Rating - " + response.data.Ratings[1].Value + "\nCountry - " + response.data.Country + "\nLanguage - " + response.data.Language + "\nPlot - " + response.data.Plot + "\nActors - " + response.data.Actors + " \n-------------------------------\n";
        console.log(title + "\n" + data);
        logDataInFile(title + "\n" + data);
    }).catch(function (error) {
        console.log(error);
    });
};

function callTextFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArray = data.split("\r\n");
        dataArray.forEach(function (element) {
            var dataSearch = element.split(",");
            decideMethod(dataSearch[0], dataSearch[1]);
        });

    });
};

function logDataInFile(data) {
    var text = data + "\n";
    fs.appendFile("log.txt", text, function (error) {
        if (error) {
            return console.log(error);
        }
    });

}

decideMethod(command, query);