module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const Shopowner = require('../models/shopowner');
    
    

    try{
        await mongoose.connect('mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true');
        let result;
        switch(req.params.route){
            case 'getall':
                 result = await Shopowner.find()
                                         .select('_id username mobileNumber');
                
                if(result.length<1){
                    context.res = {
                        status : 200,
                        body : "No shopowner found"
                    };
                    context.done();
                }
                context.res = {
                    status : 200,
                    body : result
                };
            break;

            case 'getone':
                result = await Shopowner.findById(req.params.shopownerId)
                                        .select('_id username mobileNumber');
                
                if(!result){
                    context.res = {
                        status : 200,
                        body : "No shopowner found"
                    };
                    context.done();
                }
                context.res = {
                    status : 200,
                    body : result
                 };
            break;

            case 'signup':
                const hash = await bcrypt.hash(req.body.password,10);
                const shopowner = new Shopowner({
                    _id : new mongoose.Types.ObjectId,
                    username : req.body.username,
                    password : hash,
                    mobileNumber : req.body.mobileNumber
                });

                result = await shopowner.save();
                context.res = {
                    status : 200,
                    body : "Shopowner created"
                };
            break;

            case 'login':
                result = await Shopowner.findOne({username : req.body.username});
                
                if(!result){
                    context.res = {
                        status : 401,
                        body : "Auth failed"
                    };
                    context.done();
                }
                
                const same = await bcrypt.compare(req.body.password,result.password);
                
                if(!same){
                    context.res = {
                        status : 401,
                        body : "Auth failed"
                    };
                    context.done();
                }
                context.res = {
                    status : 200,
                    body : "Auth successful"
                };
            break;

            case 'patch':
                const opsObj={};
                for(const obj of req.body){
                    opsObj[obj.parameter] = obj.value;
                }

                result = await Shopowner.updateOne({_id : req.params.shopownerId},{$set : opsObj});
                context.res = {
                    status : 200,
                    body : "Shopowner updated"
                };
            break;

            case 'delete':
                result = await Shopowner.deleteOne({_id : req.params.shopownerId});
                context.res = {
                    status : 200,
                    body : "Shopowner deleted"
                };
            break;

            default :
                context.res = {
                    status : 401,
                    body : "Route not found"
                };
            break;
        }
    }
    catch(error){
        context.res = {
            status : 500,
            body : error
        };
    }
};