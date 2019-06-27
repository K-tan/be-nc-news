const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router.js");
const {
  handle404Errors,
  handleCodeErrors,
  handle500Errors,
  handleCustomErrors,
  handle404PSQLerrors
} = require("./errors");
//require error handlers in here

app.use(express.json());
app.use("/api", apiRouter);

app.get("/*", handle404Errors);
app.use(handleCodeErrors);
app.use(handleCustomErrors);
app.use(handle404PSQLerrors);
app.use(handle500Errors);
module.exports = app;
