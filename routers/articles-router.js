const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticle
} = require("../controllers/articles-controller");
const { handle405Errors } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticle)
  .all(handle405Errors);

module.exports = articlesRouter;
