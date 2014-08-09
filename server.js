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

  var People = bookshelf.Model.extend({
    tableName: 'people'
  });

  app.get('/', function (req, res) {
    console.log('achieving redirect');
    res.redirect('/home/');
  });

  app.get('/api/people', function (req, res) {
    People.fetchAll().then(function(result) {
      res.json({people: result.toJSON()});
    })
    .done();
  });

  app.get('/api/people/:id', function (req, res) {
    People.where({id: req.params.id}).fetchAll().then(function(result) {
      res.json({person: result.toJSON()});
    })
    .done();
  });

  app.post('/api/people', function (req, res) {
    People.forge(req.body)
      .save().then(function(result) {
        res.json({created: result.toJSON()});
      })
      .done();
  });

  app.put('/api/people/:id', function (req, res) {
    console.log('attempting to delete');
    console.log(req.body);
    People.where({id: req.params.id}).fetch().then(function(person) {
      return person.save(req.body);
    }).then(function(person) {
      res.json({updated: person.toJSON()});
    })
    .done();
  });

  app.delete('/api/people/:id', function (req, res) {
    var destroyedPerson;
    People.where({id: req.params.id}).fetch().then(function(person) {
      destroyedPerson = person.clone();
      return person.destroy();
    }).then(function() {
      res.json({destroyed: destroyedPerson.toJSON()});
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
      'postgres://localhost/jsi_express'
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


