const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/Courses");

module.exports = function(req, res, next) {

  const verify = jwt.verify(req.headers['authorization'], process.env.secret)
  req.user = verify.user;
  User.findOne({
      _id: verify._id
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('Unauthorized user')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })

}