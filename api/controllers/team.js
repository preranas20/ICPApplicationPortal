const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const Team = require("../models/team");

module.exports.createTeam = function(req, res){
const role=req.userData.role;

  if (role !="admin") {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  }else{
const team = new Team({
              _id: new mongoose.Types.ObjectId(),
              teamName: req.body.teamName,
              numberOfEval: 0,
              score: 0

            });
           team.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  status: 200,
                  message: "team added",
                  data:{teamId:result.id}
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
 }

 module.exports.editTeam = function(req, res){
 const role=req.userData.role;
  if (role !="admin") {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  }else{ 
    const id=req.body.id
   Team.findByIdAndUpdate(
    id,
    {
      $set:{
        teamName: req.body.teamName

      }
    },
    {new: true},
    function(err,result){
    if(err){
      console.log(err);
      res.status(500).json({
        status:500,
        error:err
      });
    }else{
      console.log(result);
      res.status(200).json({
      status:200,
      message:"Team Details updated",
      });
    }
    });
   }
 };

 module.exports.deleteTeam = function(req, res){
  const role=req.userData.role;

  if (role !="admin") {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  }else{
 
   Team.findOneAndRemove({_id:req.params.id})
     .exec(function(err, item) {
        if (err) {
            return res.json({
              status: 500, 
              message: 'Cannot remove Team'});
        }       
        if (!item) {
            return res.status(404).json(
              {status:404, 
              message: 'Team not found'});
        }  
        res.json({
          status: 200, msg: 'Team deleted.'});
    });
    
  }
 };


//show team details
module.exports.getTeam = function(req, res){
    Team
      .find({})
      .sort({score: -1})
      .exec(function(err, team) {
        res.status(200).json({
          message:"Request successful",
          status:200,
        data:team}
        )
      });

};










