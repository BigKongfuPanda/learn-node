const express = require('../index');
const app = express();

app.get('/', function(req, res) {
  res.send('Hello world')
});

app.listen(3000, function() {
  console.log('example app is listening on localhost:3000');
})