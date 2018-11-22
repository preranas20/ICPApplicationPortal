const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deviceId: {
        type:String
    },
    user_id:{
    	type:String
    },
    phone:{
    	type:String
    }
});

module.exports = mongoose.model('DeviceMapping', deviceSchema);