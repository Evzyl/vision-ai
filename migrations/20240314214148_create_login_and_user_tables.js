/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("login", function (table) {
      table.increments("id");
      table.string("hash", 255).notNullable();
      table.string("email", 255).notNullable().unique();
    })
    .createTable("users", function (table) {
      table.increments("id");
      table.string("email", 255).notNullable().unique();
      table.string("name", 255).notNullable();
      table.bigInteger("entries").defaultTo(0);
      table.timestamp("joined").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("login");
};
