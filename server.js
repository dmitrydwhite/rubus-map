'use strict';

var express = require('express');
var server = express();

var router = express.Router();

router.post('patch', function(req, res) {
  console.log('connected to server, made post request');
  console.log(req);
});

server.use('/api', router);

server.listen(3000);
