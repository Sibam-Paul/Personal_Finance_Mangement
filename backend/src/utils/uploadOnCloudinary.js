import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

// Upload an image
const uploadOnCloudinary=async function (filepath){
   try {
        if(!filepath) return null;
        const response = await cloudinary.uploader.upload(filepath)
        console.log("File is uploaded in cloudinary",response.url);

        fs.unlinkSync(filepath)

        return response;
    } 
    catch (error) {
        fs.unlinkSync(filepath);
        console.log("Error while uploading in cloudinary",error);
        return error;
   }    

}

export default uploadOnCloudinary;
