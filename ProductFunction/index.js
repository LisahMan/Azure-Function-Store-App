module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const mongoose = require('mongoose');
    const Product = require('../models/product');

    try{
       await mongoose.connect('mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true');
       let result;
       let azure;
       let blobService;
       let blob;

       switch(req.params.route){
           case 'getall':
               result = await Product.find();
               if(result.length<1){
                   context.res = {
                       status : 200,
                       body : "No product found"
                   };
                   context.done();
               }
               context.res = {
                   status : 200,
                   body : result
               };
            break;

           case 'getone':
               result = await Product.findById(req.params.productId);
               if(!result){
                   context.res = {
                       status : 200,
                       body : "No product found"
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
                azure = require('azure-storage');
                blob = require('../helperFunctions/azureBlob');

                const boundary = multipart.getBoundary(req.headers['content-type']);
                const parts = multipart.parse(req.body,boundary);        
                
                blobService = azure.createBlobService("UseDevelopmentStorage=true");
                
                let images = [];
                for(let i=6;i<parts.length;i++){
                    images.push(parts[i].filename);
                    await blob.checkBlob(blobService,'productcontainer');
                    await blob.createBlob(blobService,'productcontainer',parts[i].filename,parts[i].data); 
                }

                const product = new Product({
                    _id : new mongoose.Types.ObjectId,
                    shopId : parts[0].field,
                    name : parts[1].field,
                    category : parts[2].field,
                    typeOfProduct : parts[3].field,
                    price : parts[4].field,
                    description : parts[5].field,
                    images : images
                });

                result = await product.save();
                context.res = {
                    status : 200,
                    body : "Product created"
                };

                break; 
            
            case 'patch':
               if(req.headers['content-type']=="application/json"){
                 context.log('in json');
                 const opsObj = {};
                 for(const ops of req.body){
                     opsObj[ops.parameter] = ops.value;
                 }
                 result = await Product.updateOne({_id : req.params.productId},{$set : opsObj});
                 context.res = {
                     status : 200,
                     body : "Product updated"
                 };
               }
               else{
                const multipart = require('multipart-formdata');
                azure = require('azure-storage');
                blob = require('../helperFunctions/azureBlob');

                const boundary = multipart.getBoundary(req.headers['content-type']);
                const parts = multipart.parse(req.body,boundary);        
                
                blobService = azure.createBlobService("UseDevelopmentStorage=true");

                const updateDoc = await Product.findById(req.params.productId);
                for(const image of updateDoc.images){
                    await blob.deleteBlob(blobService,'productcontainer',image);
                }

                const opsObj = {
                    name : parts[0].field,
                    category : parts[1].field,
                    typeOfProduct : parts[2].field,
                    price : parts[3].field,
                    description : parts[4].field,
                };

                const updateImage = [];

                for(let i=5;i<parts.length;i++){
                    updateImage.push(parts[i].filename);
                    await blob.checkBlob(blobService,'productcontainer');
                    await blob.createBlob(blobService,'productcontainer',parts[i].filename,parts[i].data);
                }

                opsObj['images'] = updateImage;

                result = await Product.updateOne({_id : req.params.productId},{$set : opsObj});
                context.res = {
                    status : 200,
                    body : "Product updated"
                };
                   
               }
            break;

            case 'delete':
               
               azure = require('azure-storage');
               blob = require('../helperFunctions/azureBlob');

               blobService = azure.createBlobService("UseDevelopmentStorage=true");

               const doc = await Product.findById(req.params.productId);
                
                for(const image of doc.images){
                  await blob.deleteBlob(blobService,'productcontainer',image);
                }

                result = await doc.remove();
                context.res = {
                    status : 200,
                    body : "Product deleted"
                };
            break;

            default:
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