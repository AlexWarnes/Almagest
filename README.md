# Almagest 
_Plan your stargazing._

Almagest is a simple tool to help plan stargazing or astrophotography outings. The web app provides light 
pollution data, sunrise and sunset times, moonrise and moonset times, and forecast data in one place, 
alleviating the hassle of checking multiple sites.

## Using Almagest
_A simple three-step process_

1. **Drop a marker** on the map where you want to stargaze 
    * You can search for a city to jump to a location and drag the map to explore the light pollution contours
    * Drop your marker by clicking, and you can drag it for precision placement

2. **Select a date** using the calendar input
    * Date selected must be within 10 days due to forecast limitations
    * Safari users must manually enter the date as yyyy-mm-dd (At the time of writing Safari does not support `input type="date"`)

3. **Check conditions**
    * Clicking the _Check Conditions_ button pulls data for your marker location on the date you selected

### Stargazing 101
  * The **Stargazing 101** section provides additional information, and additional sources of information, for users who may be new to stargazing or interested in astrophotography.
  
## Technologies Used

Almagest is a simple, single page app using just HTML, CSS, and jQuery to get and display data from three APIs, and uses
a ground overlay to display light pollution data on the map.

### API List
  * [Google Maps](https://developers.google.com/maps/ "Google Maps API")
  * [Google Places](https://developers.google.com/places/ "Google Places API")
  * [AERIS Weather](https://www.aerisweather.com/ "AERIS Weather API")

### Ground Overlay with Google Maps
The light pollution data uses semi-transparent PNGs as
[Ground Overlays](https://developers.google.com/maps/documentation/javascript/examples/groundoverlay-simple "Using Ground Overlays"). 
The overlay is from [The New World Atlas of Artificial Night Sky Brightness](http://advances.sciencemag.org/content/2/6/e1600377 "The New World Atlas of Artificial Night Sky Brightness").

## Feedback?
This is a living project, so I'd love to hear from you. I have a lot of ideas for future iterations, so if there's anything you love, hate, or think would be helpful to have, feel free to shoot me a message. It will help me prioritize :-)

Enjoy the stars! - A