const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamName: { type: String, required: true },
    score:{
       type:Number, default: 0
     },
     numberOfEval:{
            type:Number, default: 0
          }
});

module.exports = mongoose.model('Team', teamSchema);