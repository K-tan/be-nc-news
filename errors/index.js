//place error handlers in here
exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ msg: "page not found" });
};

exports.handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleCodeErrors = (err, req, res, next) => {
  if (err.code) {
    res.status(err.code).send(err);
  } else {
    next(err);
  }
};
