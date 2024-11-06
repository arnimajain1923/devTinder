const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET
  });


  const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath ,
            {
                resource_type : 'auto'
            })
                    //file uploaded now remove from local
            fs.unlinkSync(localFilePath);
            // console.log(response.url);
            return response
            
    }catch(err){
        //remove locally saved temporary file if operation got failed
        fs.unlinkSync(localFilePath);
        return null ;
    }
  }

  module.exports ={uploadOnCloudinary};