'use strict';

let userSpot = [];

function initMap() {
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.80, lng: -90.04},
		zoom: 4
	});

	const northAmericaBounds = {
		north: 55.0503989366652,
		south: 9.172460840886574,
		east: -59.47565462840578,
		west: -126.0916698624644
	};
	const northAmericaOverlay = new google.maps.GroundOverlay('https://raw.githubusercontent.com/AlexWarnes/Almagest/master/Assets/ANSB_NorthAmerica_30p.png', northAmericaBounds);

	const northernSAmericaBounds = {
		north: 13.26350443207604,
		south: -14.80364876331585,
		east: -33.38588240467166,
		west: -82.04309132974223
	};
	const northernSAmericaOverlay = new google.maps.GroundOverlay('https://raw.githubusercontent.com/AlexWarnes/Almagest/master/Assets/ANSB_NSouthAmerica_30p.png', northernSAmericaBounds);
	
	northAmericaOverlay.setMap(map);
	northernSAmericaOverlay.setMap(map);


	//HANDLE CLICKS:
	//One Click drops a marker
	//Double Click zooms in, but does NOT drop a marker using timeouts

	let update_timeout = null;

	//Anywhere on the map without an overlay
	map.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
			userSpot.push(e.latLng.lat(), e.latLng.lng())
		}, 300);
	});

	map.addListener('dblclick', function(event) {
		clearTimeout(update_timeout);
	});

	//Anywhere on the North America overlay
	northAmericaOverlay.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
			userSpot.push(e.latLng.lat(), e.latLng.lng())
		}, 300);
	});

	northAmericaOverlay.addListener('dblclick', function(event) {
		clearTimeout(update_timeout);
	});

	//Anywhere on the northern South America overlay
	northernSAmericaOverlay.addListener('click', function(e) {
		update_timeout = setTimeout(function(){
			userSpot = [];
			placeMarker(e.latLng, map);
			console.log(e.latLng.lat() + ', ' + e.latLng.lng());
			userSpot.push(e.latLng.lat(), e.latLng.lng())
		}, 300);
	});

	northernSAmericaOverlay.addListener('dblclick', function(event) {
		clearTimeout(update_timeout);
	});
}

function placeMarker(latLng, map) {
	console.log(latLng);
	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		draggable: true
		});
}

// button on click
// get sundata using userSpot and $('#datePicked').val();
// 	render that data
// 		display that data
// get forecast data using userSpot and $('#datePicked').val();
// 	render that data
// 		display that data

function checkConditions() {
	$('.checkConditionsButton').on('click', function(event) {
		event.preventDefault();
		let userDate = $('#datePicked').val();
		console.log('Checking conditions for ' + userSpot + ' on ' + userDate);
		getSunData(userSpot, userDate, displaySunData);
		getForecast(userSpot, userDate, displayForecast);
	});
}

function getSunData(location, userDate, callback) {
	const settings = {
		url: 'https://api.sunrise-sunset.org/json',
		data: {
			lat: userSpot[0],
			lng: userSpot[1],
			date: userDate,
			formatted: 1
		},
		dataType: 'JSON',
		type: 'GET',
		success: callback
	}
	$.ajax(settings);
}

function displaySunData(data) {
	console.log(data);
	$('.js-sunrise').text(`${data.results.sunrise} UTC`); 
	$('.js-sunset').text(`${data.results.sunset} UTC`);
}

function getForecast(location, userDate, callback) {
	const settings = {
		url: 'https://api.apixu.com/v1/forecast.json',
		data: {
			key: '9e1547c7b1f049d9af1151052171812',
			q: userSpot[0] + ', ' + userSpot[1],
			dt: userDate
		},
		dataType: 'JSON',
		type: 'GET',
		success: callback
	};
	$.ajax(settings);
}

function displayForecast(data) {
	console.log(data);
	$('.js-sunrise').text(`${data.forecast.forecastday["0"].astro.sunrise} local`); 
	$('.js-sunset').text(`${data.forecast.forecastday["0"].astro.sunset} local`);
	$('.js-moonRise').text(`${data.forecast.forecastday["0"].astro.moonrise} local`);
	$('.js-moonSet').text(`${data.forecast.forecastday["0"].astro.moonset} local`);
	$('.js-cloudConditions').text(`${data.forecast.forecastday["0"].hour["20"].condition.text}`);
	$('.js-cloudCover').text(`(${data.forecast.forecastday["0"].hour["20"].cloud}%)`);
	$('.js-temp').text(`${data.forecast.forecastday["0"].day.maxtemp_f}/${data.forecast.forecastday["0"].day.mintemp_f} F`);
	$('.js-humidity').text(`${data.forecast.forecastday["0"].day.avghumidity}`);
}

$(checkConditions);



// function getUserSpotInfo(latLng) {
// 	let userSpotPicked = latLng.lat() + ', ' + latLng.lng();
// 	console.log(userSpotPicked);
// };

//var marker; 
//function placeMarker(location) {
// 	if (marker) {
// 		marker.setPosition(location);
// 	} else {
// 		const marker = new google.maps.Marker({
// 		position: location,
// 		map: map,
// 		draggable: true
// 		});
// 	}
// 	map.panTo(location);
// }


// function startUp() {
// 	initMap();
// 	placeMarkerAndPanTo();
// }

// $(startUp);



//GET USER CURRENT LOCATION (sample code runs inside initMap)

  //   infoWindow = new google.maps.InfoWindow;

  //   // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };

  //       infoWindow.setPosition(pos);
  //       infoWindow.setContent('Location found.');
  //       infoWindow.open(map);
  //       map.setCenter(pos);
  //     }, function() {
  //       handleLocationError(true, infoWindow, map.getCenter());
  //     });
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // }

  // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //                         'Error: The Geolocation service failed.' :
  //                         'Error: Your browser doesn\'t support geolocation.');
  //   infoWindow.open(map);
  // }