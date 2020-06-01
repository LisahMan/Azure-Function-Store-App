const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    shopownerId : {type : mongoose.Schema.Types.ObjectId,required : true},
    name : {type : String,required : true},
    district : {type : String,required : true},
    address : {type : String,required : true},
    phoneNumber : {type : String,required : true},
    description : {type : String,required : true},
    shopPic : {type : String}
});

module.exports = mongoose.model('Shop',shopSchema);
