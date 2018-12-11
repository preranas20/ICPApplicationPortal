var mongoose = require('mongoose');
const User = require("../models/user");
const Result = require("../models/result");
const Survey = require("../models/survey");
const Team = require("../models/team");
const jwt = require("jsonwebtoken");

//show team details
module.exports.getTeam = function(req, res){

    User
      .find({})
      .sort({score: -1})
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
  if ((role=="evaluator")) {
    res.status(401).json({
      "message" : "UnauthorizedError: api not allowed for evaluator"
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
  console.log(req.body.username);
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
     }
      );
     // console.log(result);
    }
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





//Create new question
module.exports.createQuestion = function(req, res){
//var userId=req.userData.userId;
//Get max
var order = 0;
Survey
  .findOne()
  .sort('-orderId')  // give me the max
  .exec(function (err, survey) {


    // your callback code
    if (survey == null)
    { order = 1;
    }
    else {
     console.log(survey.orderId);
     order = (survey.orderId)+1;
    }


    //
    const question = new Survey({
                  qId: new mongoose.Types.ObjectId(),
                  surveyId: 0,
                  qText: req.body.qText,
                  orderId: order
                });








            question.save()
                  .then(result => {
                    console.log(result);
                    res.status(201).json({
                      message: "question added to the survey",
                      status: 200
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err,
                      status: 500
                    });
                  }); //


  });


  //was here


  };


//Edit question
module.exports.editQuestion = function(req,res){
 console.log('question values ')
  console.log(req.body.qId)
  console.log(req.body.qText)
var id = req.body.qId;
  Survey.update(
    {qId: req.body.qId},
    {

        qText: req.body.qText



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
      message:"Question successfully updated"

     }
      );
     // console.log(result);
    }
    });

};


//Delete question
exports.deleteQuestion = (req, res, next) => {
  Survey.remove({ qId: req.body.qId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Question deleted",
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

//get all questions
module.exports.getAllQuestions = function(req, res){
Survey.find({})
      .sort({orderId: 1})
      .exec(function(err, survey) {
        res.status(200).json({
          message:"Request successful",
          status:200,
          data:survey}
        )
      });

};

//get results for a team by team id
module.exports.getResultForTeams = function(req, res){
Result.find({teamId: req.body.teamId })
      .exec(function(err, result) {
        res.status(200).json({
          message:"Request successful",
          status:200,
        data:result}
        )
      });

};


//save survey
module.exports.saveSurveyOld = function(req, res){
console.log(req.body)
var data = req.body.data;
console.log(evalId)
for(var item in data){
  
  var resData = data[item];

  //segregating
  var result=  new Result({
    _id: new mongoose.Types.ObjectId(),
    evalId: req.userData.userId,
    teamId: resData.teamId,
    qId: resData.qId,
      text:resData.text,
      surveyId: 0,
      answer: resData.answer

  })
    result.save()
                  .then(result => {
                    console.log(result);
                    res.status(200).json({
                      message: "survey answers added",
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
                  /*
      .save()
      .catch((err)=>{
        console.log(err.message);
      } ); */
}


/*
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
              }); */
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



  




