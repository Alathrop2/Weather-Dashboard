var searchHistory = [];
var searchCity = document.querySelector('.button');
var apiKey = 'd21652416469d0c908812cedadf14a02';
var historyContainer = document.getElementById('history');

loadHistory();
// display data functions
var displayCurrentWeather = function (data) {
  var cityBox = $('.currentCityBox');
  var currentC = $('.currentC');
  if (cityBox.children() && currentC.children()) {
    cityBox.children().remove();
    currentC.children().remove();
  }
  var temperature = ((data.current.temp - 273.15) * 9) / 5 + 32;
  var uvIndex = data.current.uvi;
  var todayDate = moment.utc(data.current.dt * 1000).format('MM/DD/YYYY');
  var currentDate = $('<div>').text(todayDate);
  var tempEL = $('<div>').text('Temp - ' + Math.floor(temperature) + '°F');
  var wind = $('<div>').text('Wind Speed - ' + data.current.wind_speed);
  var uvi = $('<div>').text('UV Index - ' + data.current.uvi);
  var humid = $('<div>').text('Humidity - ' + data.current.humidity);
  cityBox.append(currentDate, tempEL, wind, humid, uvi);
  if (uvIndex > 3.0 && uvIndex < 6.0) {
    uvi.removeClass('has-background-grey-light');
    uvi.addClass('has-background-warning');
  }
  if (uvIndex > 6.0) {
    uvi.removeClass('has-background-grey-light');
    uvi.addClass('has-background-danger');
  }
  if (uvIndex < 3.0) {
    uvi.removeClass('has-background-grey-light');
    uvi.addClass('has-background-success');
  }
  var iconurl =
    'https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png';
  var image = $('<img>').attr('src', iconurl).addClass('image is-64x64 m-auto');
  currentC.append(image);
};
// 5 day forcast display info
var fiveDayForecast = function (data) {
  var forecast = $('.forecast');
  if (forecast.children()) {
    forecast.children().remove();
  }
  for (var i = 0; i < 5; i++) {
    const element = data.list[i];
    var createDiv = $('<div>').addClass(
      ' box column has-background-primary is-size-2 is-2 has-text-centered'
    );
    var iconurl =
      'https://openweathermap.org/img/w/' + element.weather[0].icon + '.png';
    var temperature = ((element.main.temp - 273.15) * 9) / 5 + 32;
    var todayDate = moment
      .utc(element.dt * 1000)
      .add(i, 'days')
      .format('MM/DD/YYYY');
    var currentDate = $('<div>').text(todayDate);
    console.log(element);
    var tempEL = $('<div>').text('Temp - ' + Math.floor(temperature) + '°F');
    var wind = $('<div>').text('Wind Speed - ' + element.wind.speed);
    var humid = $('<div>').text('Humidity - ' + element.main.humidity);
    var image = $('<img>')
      .attr('src', iconurl)
      .addClass('image is-64x64 m-auto');
    createDiv.append(currentDate, image, tempEL, wind, humid);
    forecast.append(createDiv);
  }
};

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
      saveHistory();
      // loadHistory();
      var historyButton = document.createElement('button');
      historyButton.classList.add('is-size-5', 'button', 'is-link');
      historyButton.setAttribute('type', 'button');
      historyButton.setAttribute('id', 'historyItem');
      historyButton.textContent = city;
      historyContainer.append(historyButton);
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

// local storage

var saveHistory = function () {
  localStorage.setItem('Recent Searches', JSON.stringify(searchHistory));
};
function loadHistory() {
  searchHistory = JSON.parse(localStorage.getItem('Recent Searches'));
  if (!searchHistory) {
    console.log(searchHistory);
    searchHistory = [];
  }
  for (let i = 0; i < searchHistory.length; i++) {
    var historyButton = document.createElement('button');
    historyButton.classList.add('is-size-5', 'button', 'is-link');
    historyButton.setAttribute('type', 'button');
    historyButton.setAttribute('id', 'historyItem');
    historyButton.textContent = searchHistory[i];
    historyContainer.append(historyButton);
  }
}

searchCity.addEventListener('click', cityInfo);
let someVar = document.getElementsByClassName('is-link');
for (let i = 0; i < someVar.length; i++) {
  someVar[i].addEventListener('click', function (event) {
    newCity(this.innerHTML);
  });
}
var newCity = function (city) {
  // var city = document.querySelector('#cityName').value;
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
    });
};

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// * THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// * THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// * THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// * THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// * THEN I am again presented with current and future conditions for that city
