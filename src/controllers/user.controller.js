import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js";


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists
    // check for images, avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove pass and refresh token from response
    // check for user creation
    // return response

    const {fullName, email, username, password} = req.body
    if([fullName, email, username, password].some((field)=>field?.trim === "")){
        throw new ApiError(400, "All fields req");   
    }
    User.findOne({
        $or 
    })
})

export {registerUser}