const endPoints = require("../endpoints.json");

const getAPIEndPoints = (req, res, next) => {
  res.status(200).send(endPoints);
};

module.exports = getAPIEndPoints;
