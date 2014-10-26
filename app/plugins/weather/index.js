var http = require('http');

module.exports = function(configuration, App, logger) {
  logger("Loaded");

  var options = {
    "host": "api.openweathermap.org",
    "path": "/data/2.5/weather?units=metric&q="
  };

  var onWeather = function(answer, data) {
    if (data.match(/^(is )?the weather/i)) {
      var location = "budapest,hu";
      var matches = data.match(/in ([\w\s\,]+)/);
      if (matches) {
        location = matches[1];
      }

      return http.request(
        {
          "host": options.host,
          "path": options.path + location
        },
        function(response) {
          var str = "";
          response.on('data', function (chunk) {
            str += chunk;
          });
          response.on('end', function () {
            var data = JSON.parse(str);

            if (data.cod == 404) {
              return answer("Sorry, but I don't know where is " + location + ".");
            }
            if (data.cod != 200) {
              return answer(data.message);
            }
            return answer(
              "Now in " + data.name + " (" + data.sys.country + "):\n" +
              data.weather[0].main + ", " + data.weather[0].description + "\n" +
              "Temperature: " + Math.round(data.main.temp) + "°C"
            );
          });
        }
      ).end();
    }
  };

  App.Event.on('what', onWeather);
  App.Event.on("what's", onWeather);
};
