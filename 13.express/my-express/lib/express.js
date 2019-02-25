const http = require('http')

function createApplication() {
  return {
    get() {
      console.log('get');
    },
    listen(port, cb) {
      const server = http.createServer(function(req, res) {
        console.log(`server running at: http://localhost:${port}`);
      })
      
      return server.listen.apply(server, arguments)
    }
  }
}

module.exports = createApplication;