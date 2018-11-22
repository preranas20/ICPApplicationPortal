const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamName: { type: String, required: true },
    score:{
       type:Number
     },
     numberOfEval:{
            type:Number
          }
});

module.exports = mongoose.model('Team', teamSchema);