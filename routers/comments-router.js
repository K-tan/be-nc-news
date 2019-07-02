const express = require("express");
const commentsRouter = express.Router();
const {
  patchComment,
  removeComment
} = require("../controllers/comments-controller");
const { handle405Errors } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .patch(patchComment)
  .all(handle405Errors);

module.exports = commentsRouter;
