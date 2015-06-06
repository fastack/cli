var http = require("http")
  , fs = require('fs')
  , Path = require('path')
  , Router = require('./router.js')
  ;

module.exports = {
  start: function(config, logger) {
    console.log(config)
    var router = new Router(config);
    var server = http.createServer(function(request, response) {
      var path = request.url.split('?')[0];
      var routed = router.resolve(path);

      function respond(routed) {
        console.log(JSON.stringify(routed));
        switch(routed.type) {
          case 'file':
            fs.readFile(routed.path, 'binary', function(err, data) {
              if (err) response.end('Error')

              switch(Path.extname(routed.path)) {
                case '.html':
                  response.writeHead(200, {"Content-Type": "text/html"})
                  break;
                case '.js':
                  response.writeHead(200, {"Content-Type": "text/javascript"})
                  break;
                case '.css':
                  response.writeHead(200, {"Content-Type": "text/css"})
                  break;
                case '.map':
                  response.writeHead(200, {"Content-Type": "application/json"})
                  break;
                case '.src':
                  response.writeHead(200, {"Content-Type": "text/javascript"})
                  break;
              }
              response.write(data, 'binary');
              response.end();
            });
          break;
          case 'redirect':
            response.writeHead(302, {
              'Location': routed.path
            });
            response.end()
            break;
        };
      } // end respond() method

      if (routed.path && fs.existsSync(routed.path)) {
        // this is a request for a file that exists
        // logger.log(routed.path)
        respond(routed)
      }
      else if (routed.type === 'redirect') {
        respond(routed)
      }
      else {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.end('404 - Fastack could not find this page.');
      }

    });

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
      logger.on('reload-page', function() {
        io.emit('reload-page');
      })

      logger.on('reload-css', function() {
        io.emit('reload-css');
      })
    });

    var port = config.local.port;
    server.listen(port);

    logger.setPort(port);
    logger.log('Fastack server started at: '+ logger.chalk.yellow('http://localhost:' + port));

  }
};
