'use strict';

var express = require('express');
var request = require('request');
var app = express();

//var instagramUser = ;
//var instagramData = ;

app.get('/', function(req, res) {
	res.send('<h1>This is my app!</h1>');	  
});

app.get('/search', function(req, res) {
	res.send('<h1>Enter user name here!</h1>');
});
 
app.listen(3000, function(){
	console.log('Front-end server is running on port 3000...');
});

var user = "agustinvargas11";

request('https://www.instagram.com/' + user + '/media', function(error, response, body) {
		var likes = 0,
			comments = 0,
			mostLikes = 0,
			mostLikedPhoto,
			mostLikedPhotoCaption,
			mostLikedPhotoLink;
	
	var data = JSON.parse(body);
	console.log(data);
	if (error) {
		console.log('error'); 
		return 1;
	}
		
	for (var i = 0; i < data.items.length; i++) {
		likes += data.items[i].likes.count;
		comments += data.items[i].comments.count;
		
		if (mostLikes < data.items[i].likes.count) {
			mostLikes = data.items[i].likes.count;
			mostLikedPhoto = data.items[i].images.low_resolution.url;
			mostLikedPhotoLink = data.items[i].link;
			if (data.items[i].caption !== null) {
				mostLikedPhotoCaption = data.items[i].caption.text;
			} else if (data.items[i].caption === null) {
				mostLikedPhotoCaption = '';
			}
			
		}
	}
	console.log('total likes: ' + likes);	
	console.log('total comments: ' + comments);
	console.log('most likes in one pic: ' + mostLikes);
	console.log('most liked image: ' + mostLikedPhoto);
	console.log('most liked photo caption: ' + mostLikedPhotoCaption);
	console.log('most liked photo url: ' + mostLikedPhotoLink);
});