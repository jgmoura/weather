// Fetches location data from Mapbox and uses latitude and longitude
// to fetch weather from specified place.
// USAGE: node app.js 'CITY' 'COUNTRY CODE'
// e.g. node app.js 'Monterrey' 'mx'

let DARK_SKY_KEY;
let MAPBOX_KEY;

if (process.env.WEATHER_APP_ENV === 'prod') {
  DARK_SKY_KEY = process.env.DARK_SKY_SECRET_KEY;
  MAPBOX_KEY = process.env.MAPBOX_TOKEN;
} else {
  const credentials = require("./credentials.js");
  DARK_SKY_KEY = credentials.DARK_SKY_SECRET_KEY;
  MAPBOX_KEY = credentials.MAPBOX_TOKEN;
}

const MAPBOX_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
const DARKSKY_URL = `https://api.darksky.net/forecast/${DARK_SKY_KEY}/`;
const request = require("request");

function getNameFromResponse(data) {
  return data.features[0].place_name;
}

function getPointsFromResponse(data) {
  return {
    longitude: data.features[0].center[0],
    latitude: data.features[0].center[1]
  };
}

function getWeatherData(location_points, location_name, callback) {
  const weather_request = DARKSKY_URL + `${location_points.latitude},${location_points.longitude}?units=si`;

  request({ url: weather_request, json: true }, function(error, response, body) {
    if (error) {
      return callback(`Error fetching weather: ${error}`, undefined);
    }

    if (response.statusCode >= 400) {
      return callback('Error communicating with DarkSky API.', undefined);
    }

    const data = {
      temperature: body.currently.temperature,
      precip_probability: body.currently.precipProbability,
      summary: body.currently.summary,
      location_name: location_name
    };
    return callback(undefined, data);
  });
}

const getLocationWeather = function(city, callback) {
  const place_request = MAPBOX_URL + `${city}.json?types=place&access_token=${MAPBOX_KEY}`;
  request({ url: place_request, json: true }, function(error, response, body) {
    if (error) {
      return callback(`Error fetching location: ${error}`, undefined);
    }

    if (response.statusCode >= 400) {
      return callback('Error communicating with Mapbox API.', undefined);
    }

    if (body.features.length === 0) {
      return callback(
        `No location found with name: ${city}`,
        undefined
      );
    }

    const location_name = getNameFromResponse(body);
    const location_points = getPointsFromResponse(body);
    getWeatherData(location_points, location_name, callback);
  });
}

module.exports.getLocationWeather = getLocationWeather;