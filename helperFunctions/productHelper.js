exports.deleteProducts =  (shopId,blob,blobService,container)=>{
  const Product = require('../models/product');
  return new Promise(async (resolve,reject)=>{
    
    try{
      const productDocs = await Product.find({shopId : shopId});
      for(const productDoc of productDocs ){
          for(const productImage of productDoc.images){
              await blob.deleteBlob(blobService,container,productImage);
          }
          await productDoc.remove();
      }
      resolve("ok");
    }
    catch(error){
        reject(error);
    }
    
      
  });
}