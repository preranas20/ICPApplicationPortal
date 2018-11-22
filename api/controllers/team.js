const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const User = require("../models/user");
const Team = require("../models/team");

module.exports.createTeam = function(req, res){
const team = new Team({
              _id: new mongoose.Types.ObjectId(),
              teamName: req.body.name    
            });
           team.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  status: 200,
                  message: "team added" 
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

 module.exports.editTeam = function(req, res){
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

 };

 module.exports.deleteTeam = function(req, res){
 
   Team.remove({ _id: req.body.id})
    .exec()
    .then(result => {
      res.status(200).json({
      	status: 200,
        message: "Team deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
      	status: 500,
        error: err
        
      });
    });

 };




