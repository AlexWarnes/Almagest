'use strict';

const STORE = {
	userSpot: [],
	marker: null
};

//Initialize map with overlays 
//Listen for input in the map search box 
//Listen for click events

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.80, lng: -90.04},
		zoom: 4,
		fullscreenControl: false,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DEFAULT,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		}
	});

	var input = document.getElementById('mapSearch');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}

		// For each place, get location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
			console.log("Returned place contains no geometry");
			return;
			}

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
		placeMarker(map.getCenter(bounds), map);
	});

	const northAmericaBounds = {
		north: 55.0503989366652,
		south: 9.172460840886574,
		east: -59.47565462840578,
		west: -126.0916698624644
	};
	const northAmericaOverlay = new google.maps.GroundOverlay('https://raw.githubusercontent.com/AlexWarnes/Almagest/master/Assets/ANSB_NorthAmerica_30p_optimizilla.png', northAmericaBounds);

	const northernSAmericaBounds = {
		north: 13.26350443207604,
		south: -14.80364876331585,
		east: -33.38588240467166,
		west: -82.04309132974223
	};
	const northernSAmericaOverlay = new google.maps.GroundOverlay('https://raw.githubusercontent.com/AlexWarnes/Almagest/master/Assets/ANSB_NSouthAmerica_30p_optimizilla.png', northernSAmericaBounds);
	
	northAmericaOverlay.setMap(map);
	northernSAmericaOverlay.setMap(map);


	//HANDLE CLICKS:
		//One Click drops a marker
		//Double Click zooms in, but does NOT drop a marker

	let update_timeout = null;

	//Clicks anywhere on the map without an overlay
	map.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			STORE.userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
		}, 300);
	});

	map.addListener('dblclick', function(e) {
		clearTimeout(update_timeout);
	});

	//Clicks anywhere on the North America overlay
	northAmericaOverlay.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			STORE.userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
		}, 300);
	});

	northAmericaOverlay.addListener('dblclick', function(e) {
		clearTimeout(update_timeout);
	});

	//Clicks anywhere on the northern South America overlay
	northernSAmericaOverlay.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			STORE.userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
		}, 300);
	});

	northernSAmericaOverlay.addListener('dblclick', function(e) {
		clearTimeout(update_timeout);
	});	
}

//ADDING A MARKER
	//If there is no marker when this function is called, then 
	//we create one from the latLng of the click or search. If 
	//there is a marker, then we set the position of the marker 
	//that already exists to the new latLng of click. This avoids
	//making multiple markers.

function placeMarker(latLng, map) {
	if (!STORE.marker) {
		STORE.marker = new google.maps.Marker({
			position: latLng,
			map: map,
			draggable: true
		});
		STORE.userSpot.push(latLng.lat(), latLng.lng());
		console.log(STORE.userSpot);
	} else {
		STORE.marker.setPosition(latLng);
		STORE.userSpot.push(latLng.lat(), latLng.lng());
		console.log(STORE.userSpot);
	}

	//Add a listener to our new marker that changes the userSpot 
	//latLng if the marker is dragged. The page initializes without
	//a marker, therefore we cannot add this listener until we
	//create one, which is why it's inside this function
	STORE.marker.addListener('dragend', function (e) { 
		STORE.userSpot = [];
		STORE.userSpot.push(e.latLng.lat(), e.latLng.lng());
		console.log(STORE.userSpot);
	});
}

//Handle click on the Check Conditions button by passing
//our STORE info to our API request
function checkConditions() {
	$('.checkConditionsButton').on('click', function(e) {
		e.preventDefault();
		let userDate = $('#datePicked').val();
		if (userDate) {
			console.log('Checking conditions for ' + STORE.userSpot + ' on ' + userDate);
			getSunMoon(STORE.userSpot, userDate, displaySunMoon)
			getForecast(STORE.userSpot, userDate, displayForecast);
		} else {
			$('#datePicked').css('border', '2px solid red');
		};
	});
}

//Request data from API
function getSunMoon(location, userDate, callback) {
	const settings = {
		url: 'https://api.aerisapi.com/sunmoon/',
		data: {
			p: STORE.userSpot[0] + ', ' + STORE.userSpot[1],
			from: userDate,
			client_id: 'YHbMRdDmHOPtUE4pkMa6n',
			client_secret: '0TG073211wIYRFlzU5ldljPIRs93v1f0LGLjMDAv',
		},
		dataType: 'JSON',
		type: 'GET',
		success: callback
	};
	$.ajax(settings);	
}

function convertTime(isoString) {
	return isoString.slice(11, 16);
}

function displaySunMoon(data) {
	console.log('Sun and Moon Data');
	console.log(data);

	const sunrise = convertTime(data.response[0].sun.riseISO);
	const sunset = convertTime(data.response[0].sun.setISO);
	const moonRise = convertTime(data.response[0].moon.riseISO);
	const moonSet = convertTime(data.response[0].moon.setISO);

	$('.js-sunrise').text(sunrise);
	$('.js-sunset').text(sunset);
	
	$('.js-moonRise').text(moonRise);
	$('.js-moonSet').text(moonSet);
	//Add moonPhase and illumination
}

function getForecast(location, userDate, callback) {
	const settings = {
		url: 'https://api.aerisapi.com/forecasts',
		data: {
			p: STORE.userSpot[0] + ', ' + STORE.userSpot[1],
			from: userDate,
			filter: '1hr',
			limit: 5,
			skip: 19,
			client_id: 'YHbMRdDmHOPtUE4pkMa6n',
			client_secret: '0TG073211wIYRFlzU5ldljPIRs93v1f0LGLjMDAv',
		},
		dataType: 'JSON',
		type: 'GET',
		success: callback
	};
	$.ajax(settings);
}

//Display API data on the page
function displayForecast(data) {
	console.log('Forecast Data');
	console.log(data);

	$('.cloudIcon7').attr('src', `https://www.aerisweather.com/img/docs/${data.response[0].periods[0].icon}`);
	$('.js-clouds7').text(`${data.response[0].periods[0].weather}`);
	$('.js-cloudCover7').text(`(${data.response[0].periods[0].sky}% cloud cover)`);

	$('.cloudIcon8').attr('src', `https://www.aerisweather.com/img/docs/${data.response[0].periods[1].icon}`);
	$('.js-clouds8').text(`${data.response[0].periods[1].weather}`);
	$('.js-cloudCover8').text(`(${data.response[0].periods[1].sky}% cloud cover)`);

	$('.cloudIcon9').attr('src', `https://www.aerisweather.com/img/docs/${data.response[0].periods[2].icon}`);
	$('.js-clouds9').text(`${data.response[0].periods[2].weather}`);
	$('.js-cloudCover9').text(`(${data.response[0].periods[2].sky}% cloud cover)`);

	$('.cloudIcon10').attr('src', `https://www.aerisweather.com/img/docs/${data.response[0].periods[3].icon}`);
	$('.js-clouds10').text(`${data.response[0].periods[3].weather}`);
	$('.js-cloudCover10').text(`(${data.response[0].periods[3].sky}% cloud cover)`);

	$('.cloudIcon11').attr('src', `https://www.aerisweather.com/img/docs/${data.response[0].periods[4].icon}`);
	$('.js-clouds11').text(`${data.response[0].periods[4].weather}`);
	$('.js-cloudCover11').text(`(${data.response[0].periods[4].sky}% cloud cover)`);


	$('.js-temp').text(`${data.response[0].periods[0].maxTempF}/${data.response[0].periods[4].minTempF} F`);
	$('.js-humidity').text(`${data.response[0].periods[0].humidity}`);
}

$(checkConditions);
