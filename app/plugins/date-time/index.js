var moment = require('moment-timezone');

module.exports = function(configuration, App, logger) {
  logger("Loaded");

  App.Event.on('what', function(answer, data) {
    if (data.match(/^time is it in/i)) {
      var location = data.match(/^time is it in ([\w\s\/]+)/i)[1];
      if (!location.match(/\//)) {
        return answer('Please give me the continent too like Europe/Budapest or America/New York.');
      }
      return answer(moment().tz(location.replace(/ /, "_")).format('YYYY-MM-DD hh:mma'));
    }
    if (data.match(/^time is it/i)) {
      return answer(moment().format('YYYY-MM-DD hh:mma'));
    }
  });
};
