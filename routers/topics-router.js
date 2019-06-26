const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require("../controllers/topics-controller");

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
