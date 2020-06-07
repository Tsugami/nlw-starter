const express = require('express');
const path = require('path');
const cors = require('cors');
const nunjucks = require('nunjucks');

const server = express();

nunjucks.configure(path.resolve(__dirname, 'views'), {
  express: server,
  noCache: true,
})

server.use(express.static(path.resolve(__dirname, '..', 'public')));
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  return res.render('index.html');
});

server.get('/create-point', (req, res) => {
  return res.render('create-point.html')
});

server.get('/search-results', (req, res) => {
  return res.render('search-results.html')
});


server.listen(5000);