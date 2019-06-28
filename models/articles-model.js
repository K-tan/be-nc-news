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

exports.addComment = ({ article_id }, comment) => {
  //passing but not 100% sure this is correct due to me manually adding article_id
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

// {
//   body:
//     'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
//   belongs_to: 'Living in the shadow of a great man',
//   created_by: 'butter_bridge',
//   votes: 14,
//   created_at: 1479818163389,
// },
