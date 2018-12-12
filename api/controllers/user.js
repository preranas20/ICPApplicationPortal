const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const User = require("../models/user");
const Result = require("../models/result");
const Survey = require("../models/survey");
const Team = require("../models/team");

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



    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });
};






//Ohm save survey new
module.exports.saveSurvey = function(req, res){
console.log(req.body)
var data = req.body.data;
//console.log(evalId)
//console.log(newTotal);
var resultSaveArray= [];
var newTotal = 0;
for(var item in data){

  var resData = data[item];
  newTotal = newTotal + resData.answer;
  

  var resultSave =  new Result({
    _id: new mongoose.Types.ObjectId(),
    evalId: req.userData.userId,
   //evalId: resData.evalId,
    teamId: resData.teamId,
    qId: resData.qId,
      text:resData.text,
      surveyId: 0,
      answer: resData.answer

  }  )

  resultSaveArray.push(resultSave);
}

  //flow
Result.find({ teamId: data[1].teamId, evalId:req.userData.userId  }) //check if email id exists before in DB
    .exec()
    .then(result => {


if (result.length >= 1) {

        console.log("Ohm");

Result.find({ teamId: data[1].teamId, evalId:req.userData.userId  }).remove().exec()
.then(result => {

        Result.insertMany(resultSaveArray)
                      .then(result => {
                                        //console.log(result);
                                      //  console.log("A");



                                        Team.find({ _id: data[1].teamId })
                                        .exec()
                                        .then(team => {
                                     //   console.log("B");
                                         if (team!=null && team.length <=0) {
                                                 //TBD
                                                 console.log("TeamNotFound");



                                               } else {


                                         //var score = team[0].score;

                                         //var numEval = team[0].numberOfEval;
                                         //console.log(numEval);

                                         var newScore2 = newTotal;
                                         var newEval2 = team[0].numberOfEval;
                                         newScore2 =Math.round( newScore2/newEval2);


        try{
                                           Team.findOneAndUpdate({_id: data[1].teamId}, {$set:{score:newScore2}}, {new: true}, (err, doc) => {
                                               if (err) {
                                                   console.log("Something wrong when updating data!");
                                                   return res.status(411).json({
                                                    message: err,
                                                    status: 410
                                                  });
                                               }

                                               console.log("success");
                                               return res.status(200).json({
                                                status: 200,
                                                message: "Auth successful",
                                                data:{ }

                                               // userId:user[0]._id,

                                              })

                                           })
                                          }catch(err) {
                                            console.log(err);
                                            res.status(500).json({
                                              error: err,
                                              status: 500
                                            });
                                          };

                                           }



                                         })
                                         .catch(err => {
                                          console.log(err);
                                          res.status(500).json({
                                            error: err,
                                            status: 500
                                          });
                                        });;


                                        //});

                                      })
                                      .catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                          error: err,
                                          status: 500
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


      } else {


console.log("survey not found saving new");
Result.insertMany(resultSaveArray)
              .then(result => {
                                //console.log(result);
                              //  console.log("A");
                                Team.find({ _id: data[1].teamId })
                                .exec()
                                .then(team => {
                             //   console.log("B");
                                 if (team!=null && team.length <=0) {
                                         //TBD
                                         console.log("TeamNotFound");



                                       } else {
                                 var score = team[0].score;
                                 
                                 var numEval = team[0].numberOfEval;
                                 console.log(numEval);
                                 var newScore = (score*numEval) + newTotal;
                                 var newEval = numEval+1;
                                 newScore =Math.round( newScore/newEval);
                                 

try{
                                   Team.findOneAndUpdate({_id: data[1].teamId}, {$set:{score:newScore, numberOfEval:newEval }}, {new: true}, (err, doc) => {
                                       if (err) {
                                           console.log("Something wrong when updating data!");
                                           return res.status(411).json({
                                            message: err,
                                            status: 410
                                          });
                                       }
                                       
                                       console.log("success");
                                       return res.status(200).json({
                                        status: 200,
                                        message: "Auth successful",
                                        data:{ }
                            
                                       // userId:user[0]._id,
                            
                                      })
                                    
                                   })
                                  }catch(err) {
                                    console.log(err);
                                    res.status(500).json({
                                      error: err,
                                      status: 500
                                    });
                                  };

                                   }



                                 })
                                 .catch(err => {
                                  console.log(err);
                                  res.status(500).json({
                                    error: err,
                                    status: 500
                                  });
                                });;


                                //});

                              })
                              .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                  error: err,
                                  status: 500
                                });
                              });





       }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });








};












//get results for evaluator's teams
module.exports.getResultForEvalTeam = function(req, res){
  const evalId = req.userData.userId;


    Result
      .find({ evalId: evalId, teamId: req.body.teamId })
      .exec(function(err, result) {
        res.status(200).json({
          message:"Request successful",
          status:200,
          data:result}

        )
      });

};


//save order
module.exports.saveOrder = function(req, res){
console.log(req.body)
var data = req.body.data;
var count = 0;
var limit = data.length;
var wait = 0;
for(var item in data){
  count = count +1;
 console.log(count)
  var resData = data[item];
  var id = resData.qId;





        try{
                                           Survey.findOneAndUpdate({qId: id}, {$set:{orderId: count}}, {new: true}, (err, doc) => {
                                               if (err) {
                                                   console.log("Something wrong when updating data!");
                                                   return res.status(411).json({
                                                    message: err,
                                                    status: 410
                                                  });
                                               }

                                               console.log("success");
                                               console.log(wait)
                                               if(wait<limit-1){
                                               wait = wait+1;
}else{

                                               return res.status(200).json({
                                                status: 200,
                                                message: "successful",
                                                data:{ }

                                               // userId:user[0]._id,
                                                     })
                                                     }
                                              //})

                                           })
                                          }catch(err) {

                                            console.log(err);
                                           return res.status(500).json({
                                              error: err,
                                              status: 500
                                            });

                                          };



}
};

