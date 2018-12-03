const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    evalId: {
        type:String
    },
    teamId:{
    	type:String
    },
    qId:{
    	type:String
    },
    text:{
        	type:String
        },
    surveyId:{
        	type:Number
        },
    answer:{
            	type:Number
            }
});

module.exports = mongoose.model('Result', resultSchema);