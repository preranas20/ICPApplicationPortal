const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({

    teamId: {
        type:String
    },
    teamName: { type: String, required: true },
    Score:{
       type:Decimal128
     },
     numberOfEval:{
            type:Number
          }
});

module.exports = mongoose.model('Team', teamSchema);