const knex = require("../connection");

exports.fetchArticleById = ({ article_id }) => {
  return knex
    .select("articles.*")
    .count({ comment_count: "articles.article_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id");
};

exports.updateArticle = (article_id, { inc_votes }) => {
  return knex("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*");
};
