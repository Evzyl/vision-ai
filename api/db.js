// api/db.js
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: {
      rejectUnauthorized: false,
      require: true,
    },
  },
  pool: { min: 0, max: 20 },
});

module.exports = db;
