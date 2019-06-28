const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticle,
  postComments,
  sendCommentsByArticleId,
  sendArticles
} = require("../controllers/articles-controller");
const { handle405Errors } = require("../errors");

articlesRouter.route("/").get(sendArticles);
articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticle)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id/comments")
  .post(postComments)
  .get(sendCommentsByArticleId);

module.exports = articlesRouter;
