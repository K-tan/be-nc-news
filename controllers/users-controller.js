const { fetchUsers, fetchUserById } = require("../models/users-model");

exports.sendUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendUserById = (req, res, next) => {
  fetchUserById(req.params)
    .then(([user]) => {
      if (!user) return Promise.reject({ msg: "page not found", code: 404 });
      res.status(200).send({ user });
    })
    .catch(next);
};
