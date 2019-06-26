const KNEX = require("knex");
const customConfig = require("./knexfile.js");

const knex = KNEX(customConfig);

module.exports = knex;
