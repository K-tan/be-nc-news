const express = require("express");
const router = express.Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const getAPIEndPoints = require("../controllers/endpoints-controller.js");
const { handle405Errors } = require("../errors");

router.use("/topics", topicsRouter);
router.use("/users", usersRouter);
router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);

router
  .route("/")
  .get(getAPIEndPoints)
  .all(handle405Errors);

module.exports = router;
