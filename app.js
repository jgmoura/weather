const express = require("express");
const weather = require("./weather.js");

const app = express();

app.get("/weather", function(req, res) {
  if (!req.query.search) {
    return res.send({
      error: "Debes enviar un search term"
    });
  }

  weather.getLocationWeather(req.query.search, function(error, response) {
    if (error) {
      return res.send({ error: error });
    }

    res.send({
      location: req.query.search,
      weather: `Today is ${response.summary.toLowerCase()}. It is currently ${
        response.temperature
      } degrees Celsius in ${
        response.location_name
      }. The probability of rain is ${response.precip_probability * 100}%.`
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("up and running");
});