const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticle,
  postComments
} = require("../controllers/articles-controller");
const { handle405Errors } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticle)
  .all(handle405Errors);

articlesRouter.route("/:article_id/comments").post(postComments);
module.exports = articlesRouter;
