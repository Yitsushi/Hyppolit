function logger() {
  console.log.apply(null, ['[' + new Date() + ']', '<HipChat>'].concat(Array.prototype.slice.call(arguments)));
}

var Bot = require('./bot').Bot;

module.exports = function(configuration, App) {
  logger("Loaded");
  var mentionRegex = new RegExp('^@' + App.bot.name + '\\b', 'i');

  bot = new Bot({
    'jid': configuration.jid + '@chat.hipchat.com',
    'password': configuration.password
  });

  bot.connect();

  bot.on('connect', function() {
    logger('connected');
    configuration.autojoin.map(function(channel) { return bot.join(channel + "@" + bot.mucHost); });
  });

  bot.on('privateMessage', function(from, message) {
    var command;

    message = message.split(" ");
    command = message.shift().toLowerCase();

    App.Event.emit(
      command,
      function(msg) { return bot.send(from, msg); },
      message.join(' ')
    );
  });
  bot.on('message', function(channel, from, message) {
    if (!message.match(mentionRegex)) { return false; }

    message = message.split(" ");
    message.shift();
    command = message.shift().toLowerCase();

    App.Event.emit(
      command,
      function(msg) { return bot.send(channel, msg); },
      message.join(' ')
    );
  });
  bot.on('invite', function(channel, from, message) {
    this.join(channel);
  });

  return function(message) {
    logger(message);
  };
};
