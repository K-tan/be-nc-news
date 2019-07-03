const { updateComment, deleteComment } = require("../models/comments-model");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  updateComment(+comment_id, req.body)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({ msg: "Comment deleted" });
    })
    .catch(next);
};
