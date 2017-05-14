const express = require('express');

const app = express();
// const http = require('http');

// const httpServer = http.Server(app);
const path = require('path');

const port = 3004;

const staticPath = path.resolve(__dirname, '../public');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, '/index.html'));
});
app.listen(port);

console.log('server running on '+port);
