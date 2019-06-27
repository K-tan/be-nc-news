const { fetchArticleById, updateArticle } = require("../models/articles-model");

exports.sendArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ msg: "page not found", status: 404 });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  updateArticle(+article_id, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// if (!article) return Promise.reject({ msg: "page not found", status: 404 });
