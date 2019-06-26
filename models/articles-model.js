const knex = require("../connection");

exports.fetchArticleById = ({ article_id }) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", article_id);
};
