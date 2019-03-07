// Fetches location data from Mapbox and uses latitude and longitude
// to fetch weather from specified place.
// USAGE: node app.js 'CITY' 'COUNTRY CODE'
// e.g. node app.js 'Monterrey' 'mx'

const credentials = require("./credentials.js");
const request = require("request");

const MAPBOX_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
const DARKSKY_URL = `https://api.darksky.net/forecast/${credentials.DARK_SKY_SECRET_KEY}/`;

function getNameFromResponse(data) {
  return data.features[0].place_name;
}

function getPointsFromResponse(data) {
  return {
    longitude: data.features[0].center[0],
    latitude: data.features[0].center[1]
  };
}

function getWeatherData(location_points, callback) {
  const weather_request =
    DARKSKY_URL +
    `${location_points.latitude},${location_points.longitude}?units=si`;

  request(weather_request, function(error, response, body) {
    if (error) {
      console.log("Error fetching weather: " + error);
      return;
    }

    const data = JSON.parse(body);
    const temperature = data.currently.temperature;
    const precip_probability = data.currently.precipProbability;
    const summary = data.currently.summary;
    return callback(temperature, precip_probability, summary);
  });
}

function getLocationWeather(city, country) {
  const place_request = MAPBOX_URL + `${city}.json?country=${country}&types=place&access_token=${credentials.MAPBOX_TOKEN}`;
  request(place_request, function(error, response, body) {
    if (error) {
      console.log(`Error fetching location: ${error}`);
      return;
    }

    const data = JSON.parse(body);
    if (data.features.length === 0) {
      console.log(`No location found with name: ${city}, ${country}`);
      return;
    }

    const location_name = getNameFromResponse(data);
    const location_points = getPointsFromResponse(data);
    getWeatherData(location_points, function(weather, precip_probability, summary) {
      console.log(
        `Today is ${summary.toLowerCase()}. It is currently ${weather} degrees Celsius in ${location_name}. The probability of rain is ${precip_probability * 100}%.`
      );
    });
  });
}

if (process.argv.length < 4) {
  console.log("Recommended usage: node app.js 'CITY' 'COUNTRY CODE'");
  console.log("Using default: node app.js 'Monterrey' 'mx'");
  getLocationWeather("Monterrey", "mx");
} else {
  getLocationWeather(process.argv[2], process.argv[3]);
}
