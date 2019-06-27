const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  voteArticle
} = require("../controllers/articles-controller");
const { handle405Errors } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(voteArticle)
  .all(handle405Errors);

module.exports = articlesRouter;
