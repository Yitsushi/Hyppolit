var events = require('events'),
    Event = new events.EventEmitter();

var App = {
  "bot": global.Configuration.bot,
  "Event": Event
};

var plugins = global.Configuration.plugins.map(function(plugin) {
  return require('./plugins/' + plugin.name)(plugin.configuration, App, Event);
});

Event.on('what', function(answer, data) {
  if (data.match(/^time is it/i)) {
    answer(new Date());
  } else {
    answer("Sorry, I don't know!");
  }
});

module.exports.App = App;
module.exports.plugins = plugins;
