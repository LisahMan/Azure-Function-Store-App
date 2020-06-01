exports.checkBlob = (blobService,container)=>{
    return new Promise((resolve,reject)=>{
      blobService.createContainerIfNotExists(container, function (error, result, response) {
        if (error) {
          reject(error);
        }
        else{
            resolve("Ok");
        }
    });
    });
}

exports.createBlob = (blobService,container,filename,data)=>{
    return new Promise((resolve,reject)=>{
        blobService.createBlockBlobFromText(container,filename,data,function(error,result,response){
                 if(error){
                     reject(error);
                 }
                 else{
                     resolve("ok");
                 }
        });
    });
}

exports.deleteBlob = (blobService,container,blob)=>{
    return new Promise((resolve,reject)=>{
     blobService.deleteBlobIfExists(container,blob,function(error,result){
         if(error){
             reject(error);
         }
         else{
             resolve("ok");
         }
     });
    });
}
