import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Code directly from the cloudinary website
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // Upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log('File Uploaded on Cloudinary');
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //Remove locally saved temp file 
    }
}

export {uploadOnCloudinary}