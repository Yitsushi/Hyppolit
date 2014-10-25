var events = require('events'),
    Event = new events.EventEmitter(),
    moment = require('moment-timezone');

var App = {
  "bot": global.Configuration.bot,
  "Event": Event,
  "Package": (function() {
    var package = require('../package.json');

    return {
      "version": package.version,
      "name": package.name,
      "description": package.description,
      "author": package.author
    };
  }())
};

var plugins = {};
global.Configuration.plugins.map(function(plugin) {
  plugins[plugin.name] = require('./plugins/' + plugin.name)(
    plugin.configuration,
    App,
    function() {
      var args = Array.prototype.slice.call(arguments);
      // Add plugin name as sender
      args.unshift('<' + plugin.name + '>');
      // Add timestamp
      args.unshift('[' + moment().format('YYYY-MM-DD hh:mma (ss.SSS)') + ']');
      console.log.apply(null, args);
    }
  );
  return true;
});

module.exports.App = App;
module.exports.plugins = (function() {
  return {
    call: function(plugin, action, data, method) {
      if (plugins.hasOwnProperty(plugin)) {
        plugins[plugin](action, data, method);
      }
    }
  };
}());
