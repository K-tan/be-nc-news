const express = require("express");
const router = express.Router();
const topicsRouter = require("./topics-router");

router.use("/topics", topicsRouter);

module.exports = router;
