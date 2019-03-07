# Weather App

This is a NodeJS weather app which lets you query information about a city's current weather information.

Prequesistes:
* Have Node.js =>10.0 installed.

Installation:

`npm install`

It takes two arguments to run:
* City name
* Country code ([According to ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2))

Example: `node app.js 'Sao Paulo' 'br'`

Should give the following output:

`Today is mostly cloudy. It is currently 20 degrees Celsius in São Paulo, São Paulo, Brazil. The probability of rain is 10%`