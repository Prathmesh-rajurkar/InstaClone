import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        max: 50,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    followings: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});
