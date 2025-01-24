var PORT = 5100;
var app = require('./api/app');
var http = require('http');
var httpServer = http.createServer(app);

httpServer.listen(PORT);
httpServer.timeout = 1200000;