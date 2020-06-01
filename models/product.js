const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    shopId : {type : mongoose.Schema.Types.ObjectId,required : true},
    name : {type : String,required : true},
    category : {type : String,required : true},
    typeOfProduct : {type : String,required : true},
    price : {type : Number,required : true},
    description : {type : String,required : true},
    images : [{type : String}]
});

module.exports = mongoose.model('Product',productSchema);