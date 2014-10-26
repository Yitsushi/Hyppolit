var Docker = require('dockerode'),
    fs     = require('fs'),
    url    = require('url');

module.exports = function(configuration, App, logger) {
  logger("Loaded");

  var docker;

  if (configuration.type === "socket") {
    var stats = fs.statSync(configuration.address);
    if (stats.isSocket()) {
      docker = new Docker({
        socketPath: configuration.address,
        timeout: 2000
      });
    }
  } else if (configuration.type === "host") {
    var data = url.parse(configuration.address);
    data.protocol = data.protocol.replace(/tcp/, 'http');
    docker = new Docker({
      protocol: data.protocol.replace(/\W/g, ''),
      host: data.hostname,
      port: data.port,
      timeout: 2000
    });
  }

  if (!docker) {
    logger("No docker found. Please configure the plugin.");
    return false;
  }

  var addListeners = function() {
    App.Event.on('docker', function(answer, data) {
      if (data.match(/^list( \w+)? containers/i)) {
        var state = data.match(/^list( \w+)? containers/i)[1];
        if (typeof state == "undefined") {
          state = "running";
        }
        state = state.trim();

        var opts = {};
        if (state === "all" || state == "stopped") {
          opts.all = true;
        }

        docker.listContainers(opts, function(err, containers) {
          if (err) {
            logger(err);
            return answer(err);
          }
          if (containers.length < 1) {
            return answer('There is no ' + state + " container.");
          }
          var _ = containers.map(function(containerInfo) {
            if (state == "running" && containerInfo.Status.match(/^Exited /)) {
              return false;
            }
            if (state == "stopped" && containerInfo.Status.match(/^Up /)) {
              return false;
            }

            var line = "";

            line = containerInfo.Names.shift().substring(1);
            line += " is ";
            if (containerInfo.Status.match(/^Exited /)) {
              line += "not ";
            }
            line += "running. It's an instance of the '" + containerInfo.Image + "' image";

            if (containerInfo.Names.length > 0) {
              line += " and linked with ";
              if (containerInfo.Names.length > 1) {
                last = containerInfo.Names.pop();
              }
              if (containerInfo.Names.length < 1) {
                line += last;
              } else {
                line += containerInfo.Names.join(', ') + " and " + last;
              }
            }

            line += '. The executed command is `';
            line += containerInfo.Command.replace(/^"|"$/g,'');
            line += '`.';

            return line;

          }).filter(function(container) {
            return container;
          }).join('\n');

          _ = 'Here is a list of ' + state + ' containers:\n' + _;
          return answer(_);
        });
      }
    });
  };

  docker.ping(function(err, data) {
    if (err) {
      logger(err);
      logger("Unloaded");
      return false;
    }
    addListeners();
  });

  return function(action, message, method) {
    logger(action + ">", message, method);
  };
};
