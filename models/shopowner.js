const mongoose = require('mongoose');

const shopownerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {type : String,required : true},
    password : {type : String,required : true},
    mobileNumber : {type : String,required : true}
});

module.exports = mongoose.model('Shopowner',shopownerSchema);