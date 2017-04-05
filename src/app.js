'use strict';

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;


app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));


app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', function(req, res) {
	res.render('index');	  
});

app.post('/', function (req, res) {
	res.redirect('/' + req.body.userName)
});

app.get('/:username', function(req, res) {
	var user = req.params.username;
	
	request('https://www.instagram.com/' + user + '/media', function(error, response, body) {
		var 	likes = 0,
			comments = 0,
			mostLikes = 0,
			mostLikedPhoto,
			mostLikedPhotoCaption,
			mostLikedPhotoLink,
			profilePicture,
			userName,
		    	item;
	
		if (body.indexOf('DOCTYPE') > 0) {
			res.render('error');
			return;
		} else if (error) {
			res.render('error'); 
			return;
		}
		
		var data = JSON.parse(body);
		
		if (!data.items.length) {
			res.render('error');
			return;
		} 
		
		for (var i = 0, n = data.items.length; i < n; i++) {
			item = data.items[i];
			likes += item.likes.count;
			comments += item.comments.count;

			if (item.caption !== null) {
				profilePicture = item.caption.from.profile_picture;
				userName = item.caption.from.username;
			}
			
			if (mostLikes < item.likes.count) {
				mostLikes = item.likes.count;
				mostLikedPhoto = item.images.low_resolution.url;
				mostLikedPhotoLink = item.link;
				
				if (item.caption) {
					mostLikedPhotoCaption = item.caption.text.slice(0, 35) + '...';
				} else if (!item.caption) {
					mostLikedPhotoCaption = '';
				}
			}
		}
		
		res.render('search', {
			userName: userName,
			likes: likes.toLocaleString(), 
			profilePicture: profilePicture,
			mostLikedPhoto: mostLikedPhoto,
			comments: comments.toLocaleString(), 
			mostLikes: mostLikes.toLocaleString(), 
			mostLikedPhotoLink: mostLikedPhotoLink,
			mostLikedPhotoCaption: mostLikedPhotoCaption,
		});
	});	
});
 
app.listen(port, function(){
	console.log('Front-end server is running on port 3000...');
});



