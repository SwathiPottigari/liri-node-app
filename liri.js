require('dotenv').config();
var keys = require("./keys.js");
var Spotify=require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');


var command = process.argv[2];

switch (command) {
    case "concert-this":
        callBandsintownAPI();
        break;
    case "spotify-this-song":
        callSpotifyAPI();
        break;
}


function callBandsintownAPI() {
    var artist = process.argv.slice(3).join(" ");
    var artistUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(artistUrl).then(function (res) {
        var response = res.data;
        response.forEach(function(element){
            console.log(element.venue.name+" at "+element.venue.city + "," + element.venue.region + " " + element.venue.country+" on "+moment(element.datetime).format("MM/DD/YYYY"));
        });     
    });
};


function callSpotifyAPI(){
    var query=process.argv.slice(3).join(" ");
    spotify.search({type:"track",query:query},function(err,res){
        if(err){
           return console.log(err);
        }
        var response=res.tracks.items;
        // console.log(res.tracks.items[0]);

        response.forEach(function(element){
            console.log(" ");
        console.log("Artists - "+element.album.artists[0].name);
        console.log("Song - "+element.name);
        console.log("Preview - "+element.preview_url);
        console.log("Album - "+element.album.name);
        console.log(" ");
        console.log("---------------------------------------");
        });         
        
    });
}