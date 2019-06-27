const { fetchArticleById } = require("../models/articles-model");

exports.sendArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      // if (!article) return Promise.reject({ msg: "page not found", code: 404 });
      res.status(200).send({ article });
    })
    .catch(next);
};
