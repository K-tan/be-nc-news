const {
  fetchArticleById,
  updateArticle,
  addComment,
  fetchCommentsByArticleId,
  fetchArticles
} = require("../models/articles-model");

//change the comment_count to an integer?
exports.sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const body = req.body;
  fetchArticles(body, sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

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

exports.postComments = (req, res, next) => {
  const article_id = req.params;
  const body = req.body;
  addComment(article_id, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;
  fetchCommentsByArticleId({ article_id }, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
// if (!article) return Promise.reject({ msg: "page not found", status: 404 });
