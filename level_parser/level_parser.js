'use strict';

const http = require('http');
const path = require('path');
const pixel = require('pixel');
const fs = require('fs');
const blockTypes = require('./block_types.js');
const levelWriter = require('./level_writer.js');

//запускаем сервер
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let level = path.join(__dirname, 'res', 'level.png');

pixel.parse(level).then(function(images){
  
  let width = images[0].width;
  let height = images[0].height;
  let data = images[0].data;

});