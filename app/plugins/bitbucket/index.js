module.exports = function(configuration, App, logger) {
  logger("Loaded");

  var methods = {
    "push": function(message) {
      logger('Got a message:', message);
    }
  };

  return function(action, message, method) {
    if (method !== "post") {
      return false;
    }
    if (methods.hasOwnProperty(action)) {
      return methods[action](message);
    }
  };
};
