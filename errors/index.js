//place error handlers in here

exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ msg: "page not found" });
};

exports.handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
exports.handleCodeErrors = (err, req, res, next) => {
  const psqlCodes = ["23502", "23503", "42703", "22P02"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request Invalid Data" });
  } else {
    next(err);
  }
};

exports.handle404PSQLerrors = (err, req, res, next) => {
  const psqlCodes = [];
  //   console.log(err);
  if (psqlCodes.includes(err.code)) {
    res.status(404).send({ msg: "Page not found" });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
};
