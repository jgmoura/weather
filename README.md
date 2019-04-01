# Weather App

This is a NodeJS weather app which lets you query information about a city's current weather information.

Prequesistes:
* Have Node.js =>10.0 installed.

Installation:

`npm install`

Example: `localhost:3000/weather?search=Monterrey`

Should give the following output:

```json
{
"location": "Monterrey",
"weather": "Today is mostly cloudy. It is currently 10.44 degrees Celsius in Monterrey, Nuevo León, Mexico. The probability of rain is 0%."
}
```