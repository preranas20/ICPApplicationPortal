const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({

    surveyId:{
        type:String
    },
    qId: {
        type:String
    },

    qText: { type: String, required: true },

    orderId:{
       type:Number
     }
});

module.exports = mongoose.model('Survey', surveySchema);