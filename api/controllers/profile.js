var mongoose = require('mongoose');
const User = require("../models/user");
const Message = require("../models/message");
const Device = require("../models/device");
const jwt = require("jsonwebtoken");

//show team details
module.exports.getTeam = function(req, res){

    User
      .find({})
      .exec(function(err, user) {
        res.status(200).json({
          message:"Request successful",
          status:200,
        data:user}
        )
      });

};



//show evaluators list to Admin
module.exports.getEvaluatorsList = function(req, res){
  const role=req.userData.role;
  if (!(role=="evaluator")) {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  } else {
    User
      .find({ role: 'evaluator' })
      .exec(function(err, user) {
        res.status(200).json({
          message:"Request successful",
          status:200,
          data:user}

        )
      });
  }
};

//Edit evaluator
module.exports.editEvaluator = function(req,res){
  const id=req.userData.userId;
  User.findByIdAndUpdate(
    id,
    {
      $set:{
        username: req.body.username

      }
    },
    {new: true},
    function(err,result){
    if(err){
      console.log(err);
      res.status(500).json({
        error:err,
        status:500
      });
    }else{
      console.log(result);
      res.status(200).json({
      status:200,
    message:"Request successful",
      result


     // console.log(result);
    })
    });

};

//Delete evaluator
exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted",
        status: 200
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











//show devices for a developer
module.exports.showDevices = function(req, res){
  const id=req.userData.userId;
  if (!id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Device
      .find({APIKey: req.body.APIKey })
      .exec(function(err, device) {
        res.status(200).json(
        device
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};



//To test
module.exports.addMessage = function(req, res){
const message = new Message({
              _id: new mongoose.Types.ObjectId(),
              deviceId: req.body.deviceId,
              message: req.body.message,
              date: req.body.date,
              from: req.body.from,
              to: req.body.to,
              status: req.body.status
            });
message.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "message added",
                  status: 200
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  status: 500
                });
              }); }

//show message log details for device
module.exports.showLogs = function(req, res){
  var userId= req.body.user_id;
  console.log(userId);
  const id=req.userData.userId;
  if (!id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Message
      .find({user_id: userId? userId:id })
      .exec(function(err, message) {
        res.status(200).json({
          message:"Request successful",
          status:200,
        data:message}
        
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};

module.exports.addDevice = function(req, res){
var userId=req.userData.userId;
  const device = new Device({
              _id: new mongoose.Types.ObjectId(),
              deviceId: req.body.deviceId,
              phone: req.body.phone,
              user_id: userId
            });
        device.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "device added",
                  status: 200
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



  




