const express = require("express");
const commentsRouter = express.Router();
const { patchComment } = require("../controllers/comments-controller");
articlesRouter
  .route("/:comment_id")
  .patch(patchComment)
  .all(handle405Errors);

module.exports = commentsRouter;
