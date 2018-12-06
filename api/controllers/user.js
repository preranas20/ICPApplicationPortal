const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const User = require("../models/user");


exports.create_evaluator = (req, res, next) => {
  const role=req.userData.role;
  if ( role != "admin") {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  } else {
  User.find({ email: req.body.email }) //check if email id exists before in DB
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email address exists",
          status: 409
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => { //hashing and salting password
          if (err) {
            return res.status(500).json({
              error: err,
              status: 500
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              role: "evaluator",
              APIKey: APIKey.apikey(),
              username:req.body.username
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  status: 200,
                  message: "Evaluator created",
                  data:{ qrcode:result.APIKey}
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  status: 500
                });
              });
          }
        });
      }
    });
  }
};


exports.user_login = (req, res, next) => {
  //in case we login from portal we need only admin to login but from mobile we need to let evaluator login as well
  var onlyAdmin = req.body.isPortal;
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1 || (onlyAdmin&&user[0].role=="evaluator")) {
        return res.status(401).json({
          message: "Not Authorized",
          status: 401
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
            status: 401
          });
        }
        if (result) {
          const token = jwt.sign(
            { //payload
              //email: user[0].email,
              role: user[0].role,
              userId: user[0]._id
            },
            process.env.JWT_KEY, //private key
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            status: 200,
            message: "Auth successful",
            data:{ token: token,
            role:user[0].role}

           // userId:user[0]._id,

          });
        }
        res.status(401).json({
          message: "Auth failed",
          status: 401
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });
};


//Login QR code
exports.loginQRCode = (req, res, next) => {
    User.find({ APIKey: req.body.key })
    .exec()
    .then(user => { //if exists in table and role is evaluator
      if (user.length < 1 || (user[0].role!="evaluator")) {
        return res.status(401).json({
          message: "Not Authorized",
          status: 401
        });
      }
      bcrypt.compare(1, 1, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
            status: 401
          });
        }
        if (result) {
          const token = jwt.sign(
            { //payload
              //email: user[0].email,
              role: user[0].role,
              userId: user[0]._id
            },
            process.env.JWT_KEY, //private key
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            status: 200,
            message: "Auth successful",
            data:{ token: token,
            role:user[0].role}

           // userId:user[0]._id,

          });
        }
        res.status(401).json({
          message: "Auth failed",
          status: 401
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });
};
