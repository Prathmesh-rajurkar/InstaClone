import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    text:{
        type:String,
        max:500,
        required:true,
    }
},{timestamps:true});

export const Comment = mongoose.model("Comment", commentSchema);