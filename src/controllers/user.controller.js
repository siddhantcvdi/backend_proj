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

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user  = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    }catch(error){
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password} = req.body
    if([fullName, email, username, password].some((field)=>(field?.trim() === "")|| field === undefined)){
        throw new ApiError(400, "All fields req");
    }

    const existedUser = await User.findOne({$or: [{username},{email}]})
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }
console.log(req.files);

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverimage[0]?.path;

    let avatarLocalPath, coverImageLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0)
        avatarLocalPath = req.files.avatar[0].path
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
        coverImageLocalPath = req.files.coverImage[0].path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar  = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // console.log(coverImage);
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

const loginUser = asyncHandler(async (req, res) => {
    /*
    Get Details from user
    Check details for null values
    Check if user exists or not
    Compare passwords
    Generate and return tokens using cookies
     */
    // console.log(req.headers);
    const {email, username, password} = req.body
    if([email, username, password].some((field) => (field?.trim() === "" || field === undefined))){
        throw new ApiError(400, "Enter Username and Password")
    }

    const user = await User.findOne({$or:[{email}, {username}]})
    console.log("User ->",user);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid  = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(404, "Invalid User Credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            loggedInUser,
            accessToken,
            refreshToken
        },
        "User Logged in Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const loggedOutUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    // console.log("Logged Out User, ", loggedOutUser);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{}, "User Logged Out"));
})
export {registerUser, loginUser, logoutUser}