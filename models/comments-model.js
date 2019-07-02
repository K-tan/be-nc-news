const knex = require("../connection");

exports.updateComment = (comment_id, { inc_votes }) => {
  // if (inc_votes === undefined)
  //   return Promise.reject({
  //     msg: "page not found",
  //     status: 404
  //   });
  return knex("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.deleteComment = comment_id => {
  return knex("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
