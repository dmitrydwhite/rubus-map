'use strict';

var _ = require('lodash');
var express = require('express');

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);
var bluebird = require('bluebird'), Promise = bluebird;
var pg = bluebird.promisifyAll(require('pg'));



var createApp = module.exports.app = function (options, client) {
  var app = express();
  app.use(require('morgan')(env === 'development' ? 'dev' : 'default'));
  app.use(require('body-parser')());
  app.use(require('method-override')());
  app.use(express.static(__dirname + '/public'));

  var Patches = bookshelf.Model.extend({
    tableName: 'patches'
  });

  app.get('/', function (req, res) {
    console.log('achieving redirect');
    res.redirect('/home/');
  });

  app.get('/api/patches', function(req, res) {
    console.log('reached get patches');
    Patches.fetchAll().then(function(result) {
      res.json({patches: result.toJSON()});
    });
  });

  app.post('/api/patches', function (req, res) {
    console.log('reached post a patch');
    Patches.forge(req.body)
      .save().then(function(result) {
        res.json({created: result.toJSON()});
      })
      .done();
  });

  return app;
};

console.log('loading server resource');

if (require.main === module) {
  var settings = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    dbURL: process.env.DATABASE_URL ||
      'postgres://localhost/rubus'
  };

  pg.connectAsync(settings.dbURL).spread(function(client, done) {
    createApp(settings, bluebird.promisifyAll(client))
    .listen(settings.port, function() {
      console.log('Express server started on port %s', settings.port);
    });
  })
  .catch(function(e) {
    console.log(e);
    console.error('Could not connect to database: %s', settings.dbURL);
    process.exit(1);
  });
}


