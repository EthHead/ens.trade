const express = require('express');

const app = express();
// const http = require('http');

// const httpServer = http.Server(app);
const path = require('path');

const port = 80;

const staticPath = path.resolve(__dirname, 'public');
app.use(express.static(staticPath));
app.use((req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, 'public/index.html'));
});
app.listen(port);

console.log('server running on '+port);
