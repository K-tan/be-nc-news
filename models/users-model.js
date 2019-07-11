const knex = require("../connection");

exports.fetchUsers = () => {
  return knex.select("*").from("users");
};

exports.fetchUserById = ({ username }) => {
  return knex
    .select("*")
    .from("users")
    .where("username", username);
  // .then(([username]) => {
  // if (!username) {
  //   return Promise.reject({ status: 404, msg: "page not found" });
  // }
  // return user;
  // });
};
