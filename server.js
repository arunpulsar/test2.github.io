// server.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// SSL options
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`The server is listening on https://localhost:${PORT} with HTTPS enabled.`);
});
