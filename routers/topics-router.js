const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require("../controllers/topics-controller");
const { handle405Errors } = require("../errors");

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
