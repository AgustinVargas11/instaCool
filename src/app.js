'use strict';

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();


app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));


app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', function(req, res) {
	res.render('index');	  
});

app.post('/', function (req, res) {
	console.log(req.body);
	res.redirect('/' + req.body.userName)
});

app.get('/:username', function(req, res) {
	var user = req.params.username;
	request('https://www.instagram.com/' + user + '/media', function(error, response, body) {
		var likes = 0,
			comments = 0,
			mostLikes = 0,
			mostLikedPhoto,
			mostLikedPhotoCaption,
			mostLikedPhotoLink,
			profilePicture,
			userName;
	
		if (body.indexOf('DOCTYPE') > 0) {
			res.render('error');
			return 1;
		} else if (error) {
			res.render('error'); 
			return 2;
		}
		var data = JSON.parse(body);
		if (data.items.length === 0) {
			console.log('PRIVATE')
			res.render('error');
			return 3;
		} 
		for (var i = 0; i < data.items.length; i++) {
			likes += data.items[i].likes.count;
;
			comments += data.items[i].comments.count;
;
			
			if (data.items[i].caption !== null) {
				profilePicture = data.items[i].caption.from.profile_picture;
				userName = data.items[i].caption.from.username;
			}
			
			if (mostLikes < data.items[i].likes.count) {
				mostLikes = data.items[i].likes.count;
;
				mostLikedPhoto = data.items[i].images.low_resolution.url;
				mostLikedPhotoLink = data.items[i].link;
				if (data.items[i].caption !== null) {
					mostLikedPhotoCaption = data.items[i].caption.text.slice(0, 35) + '...';
				} else if (data.items[i].caption === null) {
					mostLikedPhotoCaption = '';
				}
			}
		}
//		console.log('total likes: ' + likes);	
//		console.log('total comments: ' + comments);
//		console.log('most likes in one pic: ' + mostLikes);
//		console.log('most liked image: ' + mostLikedPhoto);
//		console.log('most liked photo caption: ' + mostLikedPhotoCaption);
//		console.log('most liked photo url: ' + mostLikedPhotoLink);
		console.log(userName);

		res.render('search', {likes: likes.toLocaleString(), comments: comments.toLocaleString(), mostLikes: mostLikes.toLocaleString(), mostLikedPhoto: mostLikedPhoto, mostLikedPhotoCaption: mostLikedPhotoCaption, profilePicture: profilePicture, mostLikedPhotoLink: mostLikedPhotoLink, userName: userName });
	});	
});
 
app.listen(3000, function(){
	console.log('Front-end server is running on port 3000...');
});



