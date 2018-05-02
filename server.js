const http = require('http');
const fs = require('fs');
const PNG = require('pngjs').PNG;



function onRequest(req, res) {
  req.on('data', d => {
    console.log(d);
    console.log(d.length);
  });

  res.end();
    
}

http.createServer(onRequest).listen(3000);