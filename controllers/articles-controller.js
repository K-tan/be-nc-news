const { fetchArticleById } = require("../models/articles-model");

exports.sendArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
