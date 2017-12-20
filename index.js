'use strict';

let userSpot = [];
let marker = null;

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

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
			console.log("Returned place contains no geometry");
			return;
			}
		
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
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
	//Double Click zooms in, but does NOT drop a marker using timeouts

	let update_timeout = null;

	//Clicks anywhere on the map without an overlay
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

	//Clicks anywhere on the North America overlay
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

	//Clicks anywhere on the northern South America overlay
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

//ADDING A MARKER
	//If there is no marker when this function is called, then 
	//we create one at the click point latLng that is passed when 
	//called (see click events above). Or else just set the position
	//of marker that already exists to the new latLng of click.
function placeMarker(latLng, map) {
	if (!marker) {
		marker = new google.maps.Marker({
			position: latLng,
			map: map,
			draggable: true
		});
		console.log(latLng);
	} else {
		marker.setPosition(latLng);
		console.log(latLng);
	}
	//Add a listener to our new marker that changes the userSpot 
	//latLng if the marker is dragged. The page initializes without
	//a marker, therefore we cannot add this listener until we
	//create one, which is why it's inside this function
	marker.addListener('dragend', function (e) { 
		userSpot = [];
		console.log(e.latLng.lat() + ', ' + e.latLng.lng());
		userSpot.push(e.latLng.lat(), e.latLng.lng())
	});
}

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
	$('.js-sunrise').text(`${data.forecast.forecastday["0"].astro.sunrise}`); 
	$('.js-sunset').text(`${data.forecast.forecastday["0"].astro.sunset}`);
	$('.js-moonRise').text(`${data.forecast.forecastday["0"].astro.moonrise}`);
	$('.js-moonSet').text(`${data.forecast.forecastday["0"].astro.moonset}`);

	$('.cloudIcon7').attr('src', `https:${data.forecast.forecastday["0"].hour["19"].condition.icon}`);
	$('.js-clouds7').text(`${data.forecast.forecastday["0"].hour["19"].condition.text}`);
	$('.js-cloudCover7').text(`(${data.forecast.forecastday["0"].hour["19"].cloud}%)`);

	$('.cloudIcon8').attr('src', `https:${data.forecast.forecastday["0"].hour["20"].condition.icon}`);
	$('.js-clouds8').text(`${data.forecast.forecastday["0"].hour["20"].condition.text}`);
	$('.js-cloudCover8').text(`(${data.forecast.forecastday["0"].hour["20"].cloud}%)`);

	$('.cloudIcon9').attr('src', `https:${data.forecast.forecastday["0"].hour["21"].condition.icon}`);
	$('.js-clouds9').text(`${data.forecast.forecastday["0"].hour["21"].condition.text}`);
	$('.js-cloudCover9').text(`(${data.forecast.forecastday["0"].hour["21"].cloud}%)`);

	$('.cloudIcon10').attr('src', `https:${data.forecast.forecastday["0"].hour["22"].condition.icon}`);
	$('.js-clouds10').text(`${data.forecast.forecastday["0"].hour["22"].condition.text}`);
	$('.js-cloudCover10').text(`(${data.forecast.forecastday["0"].hour["22"].cloud}%)`);

	$('.cloudIcon11').attr('src', `https:${data.forecast.forecastday["0"].hour["23"].condition.icon}`);
	$('.js-clouds11').text(`${data.forecast.forecastday["0"].hour["23"].condition.text}`);
	$('.js-cloudCover11').text(`(${data.forecast.forecastday["0"].hour["23"].cloud}%)`);


	$('.js-temp').text(`${data.forecast.forecastday["0"].day.maxtemp_f}/${data.forecast.forecastday["0"].day.mintemp_f} F`);
	$('.js-humidity').text(`${data.forecast.forecastday["0"].day.avghumidity}`);
}

$(checkConditions);

