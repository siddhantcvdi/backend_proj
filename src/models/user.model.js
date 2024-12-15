import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/*
    Basic User Schema
    Each field can be given detailed properties 
    Such as type, requirement etc.
*/

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true //Indexing is true to optimize searching in mongoDB, 
        // Don't index every field, this will cause optimization problems

        // Do more research on this...

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage:{
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: 'String',
        required: [true, "Password is Required"]
    }

})

/*
    .pre is executed before "saving" the password in mogoDB
    can be used for other things by chnaging the parameters of function
*/

userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next() //Go to the next middleware function after the execution
})

// We can add functions to userSchema in the already provided methods object
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// Do research on difference between access token and refresh token

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // This is all the payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)