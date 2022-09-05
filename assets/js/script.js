var searchHistory = [];
var searchCity = document.querySelector('.button');
var apiKey = 'd21652416469d0c908812cedadf14a02';
var historyContainer = document.getElementById('history');

// current city information
var getWeather = function (latitude, longitude) {
  var weatherData =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    latitude +
    '&lon=' +
    longitude +
    '&appid=' +
    apiKey;
  fetch(weatherData)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    });
};
// city information
var cityInfo = function () {
  var city = document.querySelector('#cityName').value;
  var apiUrl =
    'https://api.openweathermap.org/geo/1.0/direct?q=' +
    city +
    '&limit=5&appid=' +
    apiKey;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
      fiveDay(lat, lon);
      // local storage
      searchHistory.push(city);
    });
};
// 5 day forcast
var fiveDay = function (latitude, longitude) {
  var forecast =
    'https://api.openweathermap.org/data/2.5/forecast?lat=' +
    latitude +
    '&lon=' +
    longitude +
    '&appid=' +
    apiKey;
  fetch(forecast)
    .then((response) => response.json())
    .then((data) => fiveDayForecast(data));
};
