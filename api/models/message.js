const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id:{
        type:String
    },
    message: {
        type:String
    },
    date: {
            type : Date, default: Date.now
        },
    from: { type: String, required: true },
    to: {
    	type: String,
        required: true},
    status:{
       type:String
     }
});

module.exports = mongoose.model('Message', messageSchema);