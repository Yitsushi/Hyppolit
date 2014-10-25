var restify = require('restify');

var start = function(port, App, Plugins) {
  var server = restify.createServer({
    name: App.Package.name + " Web Interface",
    version: App.Package.version
  });

  server
    .use(restify.queryParser())
    .use(restify.bodyParser());

  server.get({path: "/hooks/:plugin/:action" }, function(req, res, next) {
    Plugins.call(req.params.plugin, req.params.action, req.params, 'get');
    res.send('true');
    return next();
  });
  server.post({path: "/hooks/:plugin/:action" }, function(req, res, next) {
    Plugins.call(req.params.plugin, req.params.action, req.params, 'post');
    res.send('true');
    return next();
  });

  server.get("/.*", restify.serveStatic({
    directory: "./ui",
    default: 'index.html'
  }));

  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
};

module.exports.start = start;
