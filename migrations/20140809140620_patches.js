'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('patches', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('location');
    table.integer('fecundity');
    table.integer('maturity');
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('patches');
};
