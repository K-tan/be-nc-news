const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router.js");
const { handle404Errors, handleCodeErrors } = require("./errors");
//require error handlers in here

app.use(express.json());
app.use("/api", apiRouter);

app.get("/*", handle404Errors);
app.use(handleCodeErrors);

module.exports = app;
