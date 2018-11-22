const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamName: { type: String, required: true },
    score:{
       type:Decimal128
     },
     numberOfEval:{
            type:Number
          }
});

module.exports = mongoose.model('Team', teamSchema);