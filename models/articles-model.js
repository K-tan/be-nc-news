const knex = require("../connection");

exports.fetchArticles = ({ article_id }, sort_by, order, author, topic) => {
  return knex
    .select("articles.*")
    .count({ comment_count: "articles.article_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("articles.topic", "=", topic);
    });
};

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
  if (inc_votes === undefined)
    return Promise.reject({
      msg: "Bad Request Invalid Data",
      status: 400
    });
  return knex("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*");
};

exports.addComment = ({ article_id }, comment) => {
  const input = {
    author: comment.username,
    article_id: article_id,
    body: comment.body
  };
  return knex
    .insert(input)
    .into("comments")
    .returning("*");
};

exports.fetchCommentsByArticleId = ({ article_id }, sort_by, order) => {
  return knex("comments")
    .where("comments.article_id", article_id)
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy(sort_by || "created_at", order || "desc");
};
