module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const mongoose = require('mongoose');
    const Shop = require('../models/shop');

    try{
       await mongoose.connect('mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true');
       let result;
       let azure;
       let blob;
       let blobService;

       switch(req.params.route){
            case 'getall':
               result = await Shop.find();
               if(result.length<1){
                   context.res = {
                       status : 200,
                       body : "No shop found"
                   };
                   context.done();
               }
               context.res = {
                   status : 200,
                   body : result
               };
            break;

            case 'getone':
                result = await Shop.findById(req.params.shopId);
                if(!result){
                    context.res = {
                        status : 200,
                        body : "No shop found"
                    };
                    context.done();
                }
                context.res = {
                    status : 200,
                    body : result
                };
            break;

            case 'create':
                const multipart = require('multipart-formdata');
                const boundary = multipart.getBoundary(req.headers['content-type']);
                const parts = multipart.parse(req.body,boundary);
                
                const shop = new Shop({
                    _id : new mongoose.Types.ObjectId,
                    shopownerId : parts[0].field,
                    name : parts[1].field,
                    district : parts[2].field,
                    address : parts[3].field,
                    phoneNumber : parts[4].field,
                    description : parts[5].field
                });
    
                if(parts.length==7){
                  azure = require('azure-storage');
                  blobService = azure.createBlobService("UseDevelopmentStorage=true");
                  blob = require('../helperFunctions/azureBlob');
                 await blob.checkBlob(blobService,'shopcontainer');
                 await blob.createBlob(blobService,'shopcontainer',parts[6].filename,parts[6].data);
                 shop['shopPic']=parts[6].filename;
                }
                
                result = await shop.save();
                context.res = {
                    status : 200,
                    body : "Shop created"
                };
            break;

            case 'patch':
                const opsObj = {};
                for(const obj of req.body){
                    opsObj[obj.parameter]=obj.value;
                }
                result = await Shop.updateOne({_id : req.params.shopId},{$set : opsObj});
                context.res = {
                    status : 200,
                    body : "Shop updated"
                };
            break;

            case 'delete':
                 azure = require('azure-storage');
                 blobService = azure.createBlobService("UseDevelopmentStorage=true");
                 blob = require('../helperFunctions/azureBlob');
                 const productHelper = require('../helperFunctions/productHelper');
                await productHelper.deleteProducts(req.params.shopId,blob,blobService,'productcontainer');
                const doc = await Shop.findOne({_id : req.params.shopId});
                if(doc.shopPic){
                    context.log("Shoppic");
                    await blob.deleteBlob(blobService,'shopcontainer',doc.shopPic);
                }
                result = await doc.remove();
                context.res = {
                    status : 200,
                    body : "shop deleted"
                };
            break;

            default:
                context.res = {
                    status : 200,
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