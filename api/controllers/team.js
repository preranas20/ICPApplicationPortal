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

 /*module.exports.editTeam = function(req, res){
 const id=req.body.id
   Team.findByIdAndUpdate(
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
      res.status(200).json(
      status:200,
      message:"Request successful",
      result

      );
     // console.log(result);
    }
    });

 };*/




