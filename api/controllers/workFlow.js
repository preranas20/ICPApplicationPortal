const mongoose = require("mongoose");
const http = require('http');
const User = require("../models/user");
const Device=require("../models/device");
const Message=require("../models/message");
//var URL = require('url-parse');
// fcm server 
var admin = require('firebase-admin');
var serviceAccount = require('../AccountKey/smsgateway-5d944-firebase-adminsdk-zbyn3-0ffa63630d.json');

module.exports.SendToDevice= function(req, res){
  //console.log(req.body);
var apiKey =req.body.apiKey;
  var phoneNumer=req.body.phone;
  var messageText=req.body.messageText;
  var toPhoneNumber=req.body.toPhoneNumber;
 if(! admin.apps.length)

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smsgateway-5d944.firebaseio.com"
  });
 // console.log(phone);
 validateUser(apiKey,function name(err,params) {
   //console.log(err);
   //console.log('userValue', params);
   if(err){
   console.log('Error sending message:', error);
   res.status(500).json({
     message: err,
     status: 500
   });
   return;
  }
  if(params==null ){
    res.status(500).json({
      message: "not a registered developer. Incorrect API key",
      status: 500
    }); 
    return;
  }

  getDevice(phoneNumer,params._id,function(err1,data){
//this registration token is deviceID from the Device model
if(err1){
  console.log('Error sending message:', error);
  res.status(500).json({
    message: err,
    status: 500
  });
  return;
 }
 if(data==null ){
  res.status(500).json({
    message: "phone number not associated with this developer.",
    status: 500
  }); 
  return;
}
var newmessage = new Message({
  _id: new mongoose.Types.ObjectId(),
   message: messageText,
   date: Date.now(),
   from: phoneNumer,
   to:toPhoneNumber,
   status:"DownStream",
   user_id:data.user_id
  // phone:req.body.phone
 });
      var registrationToken =  data.deviceId;
      console.log('sending sms to mobile...');
// See documentation on defining a message payload.
      var message = {
        
      data: {
        title: toPhoneNumber,
        body: messageText
        },
      
      token: registrationToken
      };

// Send a message to the device corresponding to the provided
// registration token.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      
        newmessage
           .save()
           .then(result => {
            console.log("logging done");
            res.status(201).json({
        
              message: "Successfully sent message",
              status: 200
            });
           })
            .catch(err => {
            console.log(err);
           
          });
        
       
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        res.status(500).json({
          message: err,
          status: 500
        });
      });
    });
  });
  
};

var getDevice = function (req,id,next) {
  console.log('getting device for this phone number.')
  var phoneNumber= req;
  console.log(phoneNumber);
  Device
  .find({$and:[{ phone: phoneNumber },{ user_id: id }]})
  .exec(function(err, device) {
    console.log(device[0]);
   next(err,device[0]);
  });
};
var validateUser= function(key,next) {
  console.log("userAPIKey: ",key);
  User
  .find({ APIKey: key })
  .exec(function(err, user) {
    console.log("error for API Key",err);
    console.log(user[0]);
   next(err,user[0]);
  });
  
}
var ReceiveToGateway = function(dev, next){
 console.log('getting useridfor this phone number.',dev)
 
};


    
module.exports.receivedMessage = function(req,res){
  var dev=req.body.deviceId;
  console.log(dev);
  console.log("Inside receivedMessage");
  Device
  .findOne({ deviceId : dev })
  .exec(function(err,data){
    console.log("error:",err);
    console.log(data);
    User.find({_id:data.user_id})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User Not Found",
          status: 401
        });
      }
     else {
//copy from here

console.log("i am hitting my method");
const postData = {
phone: req.body.from,
messageText:req.body.message};

//var parsedUrl = URL(user.callback_webhook);
var postrequest = require('request')
var options = {
  method: 'post',
  body: postData,
  json: true,
  url: user[0].callback_webhook
}
postrequest(options, function (err, res1, body) {
  if (err) {
    console.error('error posting json: ', err)
    res.status(500).json({
      error: err,
      status: 500
    });
  }
  const message = new Message({
    _id: new mongoose.Types.ObjectId(),
     message: req.body.message,
     date: Date.now(),
     from: req.body.from,
     to: data.phone,
     status:"Upstream",
     user_id:data.user_id
    // phone:req.body.phone
   });
   message
     .save()
     .then(result => {
       console.log(user[0]);
       
       res.status(201).json({
        
         callback_webhook:user[0].callback_webhook,
         textmessage:req.body.message,
         from:req.body.from,
         to:data.phone,
         message: "Message Received",
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
})
  //till here 

        
         
        }

    })
   
    });


};


