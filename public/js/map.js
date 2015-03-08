
$(document).ready(function () {

	var pearlstagram = {

		choice: ' ',
		markerIcon : ' ',
		caption: ' ',
		photoUrl : ' ',
		result : { },
		j : 0,
		k : 0,
		numberOfPics : 30,
		next_url : ' ',


		initialize: function () {
			this.startListening();
			// this.search(this.choice);

		},

		// events listening
		startListening: function () {
			// on a click on the submit button or press enter key, functions stores what the user typed in the input and saves it as a parameter for the search function
			$('#search').on('click', $.proxy(this.onSearch, this)); 
			$('#userinput').bind("enterKey",function(e){
 				pearlstagram.onSearch();
			});
			// if enter key is pressed, start the search
			$('#userinput').keyup(function(e){
			    if(e.keyCode == 13)
			    {
			        $(this).trigger("enterKey");
			    }
			});
		},


		// events handling

		onSearch : function () {

			// clears the map
			$('#map_canvas').removeClass('active');
			$('#aside > ul').empty();	
			$('#image').removeClass('active');
			$('#image').empty();

			this.j = 0;			
			this.k = 0;			
			// gets the input from the user 
			this.choice = $('#userinput').val(); 


			// search users or search tags
			if($('.searchbox > select').val() === 'tag'){
				this.searchByTags();
			} else {
				if ($('.searchbox > select').val() === 'user') {
					this.searchByUsers();
				};
			}
		},


		// actions


		searchByTags: function () {
			// query for 50 pics 
			$.ajax({                
				url: 'https://api.instagram.com/v1/tags/' + this.choice + '/media/recent?access_token=32168991.82908a0.5f31d75438944306a39a0ded8af7204e&count=50', 
				dataType: 'jsonp'  // asks for json
			})
			.done($.proxy(function (r) {  // when the query is done, play this function and store the response in 'r'

				var result = r.data; // stores the object returned by api in var result

				//url provided by api to query the next 50pics
				this.next_url = r.pagination.next_url;

				this.result = result;
				// displaying the map
				
				googlemaps.initialize();						

				this.extractingData();				

			}, this));
		},

		extractingData : function () {

				result = this.result;
				//running through the pictures returned by api to find pics with location enabled
				//and displaying a marker for each one
				for (var i in result) {

					// testing if location information exists with the pic and display the pic on the map
					if (result[i].location !== null) {

						this.j++; //counts pics displayed on the map
						
						//storing latitude and longitude in variables
						var photolatitude = result[i].location.latitude;
						var photolongitude = result[i].location.longitude;

						// stores thumbnail url in variable
						this.markerIcon = result[i].images.thumbnail.url;

						//display caption if there's one
						if (result[i].caption !== null) {
							this.caption = result[i].caption.text;
						} else {
							this.caption = ' ';
						};
						// store pic url in variable
						this.photoUrl = result[i].images.standard_resolution.url;
						//sending the variables to googlemaps object

						// share latitude with google maps object and display a marker
						googlemaps.latitude = photolatitude;						
						googlemaps.longitude = photolongitude;
						googlemaps.DisplayMarker();
					} else {
						// if number of pic without location info is too high => stop searching
						this.k++; // keeps count of pics returned without location info
						if (this.j+this.k > 400) {
							if (pearlstagram.j === 0) {
								// if no pic with location enabled is found
								$('#mosaic').empty();
								$('#mosaic').append("<p>Sorry, this user doesn't share the location of his instagram pics</p><input id='backtosearchresults' value='Back to search results' type='button'>");
								$('#backtosearchresults').on('click', function(){pearlstagram.onSearch()}); 
							} else {
								return false;
							}
						}
					}

				}
				// if number of pics displayed on the map is under 30, query another batch of pics
				if (this.j < this.numberOfPics) {
					$.ajax({                  
						url: this.next_url, 
						dataType: 'jsonp'  // asks for json
					})
					.done($.proxy(function (r) {  // when the query is done, play this function

						this.result = r.data;
						// store the next next url
						this.next_url = r.pagination.next_url;
									
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

		latitude: 19.921713,
		longitude: -50.800781,
		myLatlng : { },
		mosaicHover : true,
		

		initialize : function () {

			this.DisplayMap();
		},


		constructMylatlng : function () {

			// construct object with latitude and longitude coordinates
			var myLatlng = new window.google.maps.LatLng(this.latitude, this.longitude);
			this.myLatlng = myLatlng;
		},
		/**
		 * Displays map in HTML
		 */
		DisplayMap : function () {

			this.constructMylatlng();
				
			console.log(this.myLatlng);

			// options for the map
	        var mapOptions = {
	          center: this.myLatlng,
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

	        this.map = map;
		},

		DisplayMarker : function () {

	        this.constructMylatlng();

	        // constructs a marker and displays in on the map
	        var myMarker = new window.google.maps.Marker({
	        	position : this.myLatlng,
	        	map : this.map,	
	        	icon : 'http://www.msccroisieres.be/be_fr/Images/Instagram_Icon_32x32_tcm17-74869.png',
	        	title: pearlstagram.caption,
	        	number: pearlstagram.i,
	        	photo : pearlstagram.photoUrl,
	        	caption : pearlstagram.caption,
	        	animation : google.maps.Animation.DROP
	        });


	        this.myMarker = myMarker;

	        this.displayMosaic(myMarker);

	        this.onMarkerClick(myMarker);

		},

		displayMosaic : function(myMarker){

			var thumbnail;
		 	$('#aside').addClass('active');
		 	$('ul#mosaic').addClass('noshade');
		 	$('#mosaic').animate({opacity: "1", zIndex: "2"}, 1, function(){});
		 	$('#aside').addClass('mosaic');
		 	$('#aside > ul').animate({display: "block"}, 1, function(){});
		 	$('#aside > ul').append('<li class="pic"><img class="thumbnail" src="' + myMarker.photo + '"/></li>');
		 	thumbnail = $('#aside ul#mosaic li:last-child');
		 	//animate pics on arriving
	   		setTimeout(function(){
	   			 $('#aside ul#mosaic li img').addClass('active');
	   		}, 100);

		 
		 	this.onMosaicClick(myMarker, thumbnail);
		 	this.onMosaicHover(myMarker, thumbnail);

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

		onMosaicClick : function(myMarker, thumbnail) {


		 	$(thumbnail).on('click', $.proxy(
		 		function(){
		 			$('html, body').animate({scrollTop:"-100"}, 'slow');
		 			$('#image').removeClass('active');
		 			this.displayBigPic(myMarker);
		 			myMarker.setAnimation(google.maps.Animation.BOUNCE);
		 			setTimeout(function(){
   			 			myMarker.setAnimation(null)
   			 		}, 700);

		 			this.map.panTo(myMarker.getPosition());
		 			var zoomLevel = 4;
		 			this.map.setZoom(zoomLevel);

		 	
		 		}, this));

			
		 	
		},

		onMarkerClick : function(myMarker) {
			
	        google.maps.event.addListener(myMarker, 'click', $.proxy(function() {
    			// this.map.setZoom(2);
    			$('html, body').animate({scrollTop:"-100"}, 'slow');
    			$('#image').removeClass('active');
    			this.displayBigPic(myMarker);
   			 	this.map.setCenter(myMarker.getPosition());
   			 	myMarker.setAnimation(google.maps.Animation.BOUNCE);
   			 	setTimeout(function(){
   			 		myMarker.setAnimation(null)
   			 	}, 700);
   			 	// allows to center the map on the clicked marker and on the same zoom level
				var zoomLevel = this.map.getZoom();

	   			 	
 			 },this));
		},

		onZoomButtonClick : function(myMarker) {
		 	$('#zoomButton').on('click', $.proxy(
		 		function(){
		 			myMarker.setAnimation(google.maps.Animation.BOUNCE);
		 			setTimeout(function(){
   			 			myMarker.setAnimation(null)
   			 		}, 700);

		 			this.map.panTo(myMarker.getPosition());
		 			var zoomLevel = 2;
		 			this.map.setZoom(zoomLevel);

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 4;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 2000);	

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 7;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 4000);	  


	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 5;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 6000);

		 	
		 		}, this));	
		},

		displayBigPic: function(myMarker) {
			
		 	$('#image').empty();
		 	$('#image').prepend('<img src="' + myMarker.photo + '"/>');
		 	$('#image').append('<p class="caption">' + myMarker.caption + '</p>');
		 	$('#image').append('<input type="button" id="zoomButton">');
		 	console.log('hello world');
		 	this.onZoomButtonClick(myMarker);
			$('#image').addClass('active');

		},
		onZoomButtonClick : function(myMarker) {
		 	$('#zoomButton').on('click', $.proxy(
		 		function(){
		 			myMarker.setAnimation(google.maps.Animation.BOUNCE);
		 			setTimeout(function(){
   			 			myMarker.setAnimation(null)
   			 		}, 700);

		 			this.map.panTo(myMarker.getPosition());
		 			var zoomLevel = 2;
		 			this.map.setZoom(zoomLevel);

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 4;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 2000);	

	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 7;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 4000);	  


	   			 	setTimeout($.proxy(function(){
	   			 		zoomLevel = zoomLevel + 5;
	   			 		this.map.setZoom(zoomLevel);
	   			 	},this), 6000);

		 	
		 		}, this));	
		},


	};


pearlstagram.initialize();
// googlemaps.initialize();
});

