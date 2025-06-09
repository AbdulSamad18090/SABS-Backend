const knex = require("knex");

const knexConfig = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "As_pg_18090",
    database: "SABS",
  },
};

const db = knex(knexConfig);

module.exports = db;
