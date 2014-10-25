global.Configuration = require('./config.json');

var app = require('./app'),
    web = require('./web');

web.start(process.env.PORT || 8080, app.App, app.plugins);
