const express = require('express');
const path = require('path');

const app = express();
app.configure(() => {
  app.use(
      '/', // the URL throught which you want to access to you static content
      express.static(path.joint(__dirname, '/public')), // where your static content is located in your filesystem
  );
});
app.listen(4000); // the port you want to use
