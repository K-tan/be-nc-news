const express = require("express");
const usersRouter = express.Router();
const { sendUsers, sendUserById } = require("../controllers/users-controller");
const { handle405Errors } = require("../errors");

usersRouter
  .route("/")
  .get(sendUsers)
  .all(handle405Errors);

usersRouter
  .route("/:username")
  .get(sendUserById)
  .all(handle405Errors);

module.exports = usersRouter;
