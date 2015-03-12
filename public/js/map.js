$(document).ready(function () {

	var pearlstagram = {
		j : 0,
		k : 0,
		// events handling
		displayPhotos : function (photos, tag) {

			// clears the map
			$('#map_canvas').removeClass('active');
			$('#aside > ul').empty();	
			$('#image').removeClass('active');
			$('#image').empty();

			var map = googlemaps.displayMap();
			var next_url = photos.pagination.next_url;
			for (var i in photos) {

				// testing if location information exists with the pic and display the pic on the map
				if (photos[i].location !== null) {

					this.j++; //counts pics displayed on the map

					var marker = googlemaps.displayMarker(photo[i], i, map);
					var thumbnail = googlemaps.displayThumbnail(photo[i]);

					googlemaps.onMarkerClick(myMarker, map);
					googlemaps.onMosaicClick(myMarker, thumbnail, map);
					googlemaps.onMosaicHover(myMarker, thumbnail);
					googlemaps.onZoomButtonClick(myMarker, map);

					
				} else {
					// if number of pic without location info is too high => stop searching
					this.k++; // keeps count of pics returned without location info
					if (this.j+this.k > 400) {
						if (pearlstagram.j === 0) {
							// if no pic with location enabled is found
							$('#mosaic').empty();
							$('#mosaic').append("<p>Sorry, this user doesn't share the location of his instagram pics</p><input id='backtosearchresults' value='Back to search results' type='button'>");
						} else {
							return false;
						}
					}
				}
			}
		},

		extractingData : function () {


				// if number of pics displayed on the map is under 30, query another batch of pics
				if (this.j < this.numberOfPics) {
					$.ajax({                  
						url: this.next_url, 
						dataType: 'jsonp'  // asks for json
					})
					.done($.proxy(function (r) {  // when the query is done, play this function

						this.result = r.data;
						// store the next next url
						
									
						this.extractingData();

					}, this));
				}
		},

		searchByUsers : function() {
			$.ajax({      // query 15 users           
				url: 'https://api.instagram.com/v1/users/search?access_token=32168991.82908a0.5f31d75438944306a39a0ded8af7204e&q=' + this.choice + '&count=15', 
				dataType: 'jsonp'  // asks for json
			})
			.done($.proxy(function (r) {  // when the query is done, play this function

				var result = r.data; // stores the object returned by api in a variable
				console.log(result);

				this.result = result;
				
				googlemaps.initialize();
				$('#image').empty();
				$('#image').removeClass('active');
				$('#aside').addClass('active');
				$('#map_canvas').addClass('active');

				//display user list with ppic, name and description
				for (var i in result) {	
					$('#mosaic').append('<div class="users" id="'+ result[i].id +'"><a href="#"><li><img src="' + result[i].profile_picture + '" /><h3>' + result[i].username + '</h3><p>'+ result[i].bio + '</p></li></a></div>');
					$('#mosaic .users li').addClass('active');
				};

				// when user is clicked
				$('#mosaic .users').on('click',function(){
					//get the user id
					id = $(this).attr('id');
					// search with his id 
					pearlstagram.searchById(id);
					// cleans the place for the pics
					$('#mosaic').empty();
					$('#image').empty();
					return false;
				}); 
			}));			

		},
		searchById : function(id) {
			$.ajax({                  //query 30 pics from the user
				url: 'https://api.instagram.com/v1/users/' + id + '/media/recent?access_token=32168991.82908a0.5f31d75438944306a39a0ded8af7204e&count=30', // asks instagram for one picture with the tag the user chooses (choice)
				dataType: 'jsonp'  // asks for json
			})
			.done($.proxy(function (r) {  

				var result = r.data; // stores the object returned by api in a variable
				console.log(r.data);
				this.next_url = r.pagination.next_url;
				this.result = result;

				this.j = 0;				
				//extract the location and display it
				this.extractingData();				
			}, this));
		},
	};

	var googlemaps = {

		/**
		 * Displays map in HTML
		 */
		displayMap : function () {

			// options for the map
	        var mapOptions = {
	          zoom: 2,
	          mapTypeId: google.maps.MapTypeId.HYBRID,
				panControl: true,
				  panControlOptions: {
				  position: google.maps.ControlPosition.RIGHT_TOP
				},
				zoomControl: true,
				zoomControlOptions: {
				  style: google.maps.ZoomControlStyle.LARGE,
				  position: google.maps.ControlPosition.RIGHT_TOP
				}
	        };

	        // constructs map and sends it to the DOM
	        var map = new window.google.maps.Map(document.getElementById("map_canvas"),
	            mapOptions);
	        $('#map_canvas').addClass('active');

	        return map;
		},

		DisplayMarker : function (photo, i, map) {

			var latitude = photos.location.latitude;
			var longitude = photos.location.longitude;
			var markerIcon = photos.images.thumbnail.url;
			var photoUrl = photos.images.standard_resolution.url;

			//display caption if there's one
			if (result[i].caption !== null) {
				var caption = photos.caption.text;
			} else {
				var caption = ' ';
			};
	        var myLatlng = new window.google.maps.LatLng(latitude, longitude);
	        // constructs a marker and displays in on the map
	        var myMarker = new window.google.maps.Marker({
	        	position : myLatlng,
	        	map : map,	
	        	icon : 'http://www.msccroisieres.be/be_fr/Images/Instagram_Icon_32x32_tcm17-74869.png',
	        	title: caption,
	        	number: i,
	        	photo : photoUrl,
	        	caption : caption,
	        	animation : google.maps.Animation.DROP
	        });

	        return myMarker;
		},

		displayThumbnail : function(photo){

		 	$('#aside').addClass('active');
		 	$('ul#mosaic').addClass('noshade');
		 	$('#mosaic').animate({opacity: "1", zIndex: "2"}, 1, function(){});
		 	$('#aside').addClass('mosaic');
		 	$('#aside > ul').animate({display: "block"}, 1, function(){});
		 	$('#aside > ul').append('<li class="pic"><img class="thumbnail" src="' + photoUrl + '"/></li>');

		 	var thumbnail = $('#aside ul#mosaic li:last-child');
		 	//animate pics on arriving
	   		setTimeout(function(){
	   			 $('#aside ul#mosaic li img').addClass('active');
	   		}, 100);

		 	return thumbnail;
		},

		onMosaicHover : function(myMarker, thumbnail){
		 	
		 	$(thumbnail).hover($.proxy(
		 		function(){
	   			 	myMarker.setAnimation(google.maps.Animation.BOUNCE);
	   			 	setTimeout(function(){
	   			 		myMarker.setAnimation(null)
	   			 	}, 700);
	   			},this), 700);
		},

		onMosaicClick : function(myMarker, thumbnail, map) {

		 	$(thumbnail).on('click', $.proxy(
		 		function(){
		 			var zoomLevel = 4;

		 			$('html, body').animate({scrollTop:"-100"}, 'slow');
		 			$('#image').removeClass('active');
		 			map.panTo(myMarker.getPosition());
		 			map.setZoom(zoomLevel);
		 			this.displayBigPic(myMarker);
		 			myMarker.setAnimation(google.maps.Animation.BOUNCE);
		 			setTimeout(function(){
   			 			myMarker.setAnimation(null)
   			 		}, 700);
		 		}, this));

			
		},

		onMarkerClick : function(myMarker, map) {
			
	        google.maps.event.addListener(myMarker, 'click', $.proxy(function() {
    			// this.map.setZoom(2);
    			$('html, body').animate({scrollTop:"-100"}, 'slow');
    			$('#image').removeClass('active');

   			 	map.setCenter(myMarker.getPosition());
   			 	myMarker.setAnimation(google.maps.Animation.BOUNCE);
   			 	setTimeout(function(){
   			 		myMarker.setAnimation(null)
   			 	}, 700);
   			 	// allows to center the map on the clicked marker and on the same zoom level
				var zoomLevel = map.getZoom();

				this.displayBigPic(myMarker);
 			 },this));
		},
		displayBigPic: function (myMarker) {
			// display big picture
		 	$('#image').empty();
		 	$('#image').prepend('<img src="' + myMarker.photo + '"/>');
		 	$('#image').append('<p class="caption">' + myMarker.caption + '</p>');
		 	$('#image').append('<input type="button" id="zoomButton">');
			$('#image').addClass('active');
		},

		onZoomButtonClick : function(myMarker, map) {
		 	$('#zoomButton').on('click', $.proxy(
		 		function(){
		 			myMarker.setAnimation(google.maps.Animation.BOUNCE);
		 			setTimeout(function(){
   			 			myMarker.setAnimation(null)
   			 		}, 700);

		 			map.panTo(myMarker.getPosition());
		 			var zoomLevel = 2;
		 			map.setZoom(zoomLevel);

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 4;
	   			 		map.setZoom(zoomLevel);
	   			 	},this), 2000);	

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 7;
	   			 		map.setZoom(zoomLevel);
	   			 	},this), 4000);	  


	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 5;
	   			 		map.setZoom(zoomLevel);
	   			 	},this), 6000);
		 	
		 		}, this));	
		},
	};
});

