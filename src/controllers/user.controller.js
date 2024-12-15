import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
// get user details from frontend
// validation - not empty
// check if user already exists
// check for images, avatar
// upload them to cloudinary
// create user object - create entry in db
// remove pass and refresh token from response
// check for user creation
// return response

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password} = req.body
    if([fullName, email, username, password].some((field)=>field?.trim() === "")){
        throw new ApiError(400, "All fields req");   
    }

    const existedUser = User.findOne({$or: [{username},{email}]})
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar  = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){throw new ApiError(500, "Error uploading avatar")}

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Error creating user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})

export {registerUser}