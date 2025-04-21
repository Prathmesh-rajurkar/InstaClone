import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { store } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

function Post({ post }) {
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comments,setComments] = useState(post.comments)
    const [commentLength,setCommentLength] = useState(post.comments.length)
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };
    const { posts } = useSelector((store) => store.post);
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? "dislike" : "like";
            setPostLike(post.likes.length);
            const res = await axios.get(
                `http://localhost:3000/api/v1/post/${post._id}/${action}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setLiked(!liked);
                setPostLike(updatedLikes);

                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    const commentHandler = async () => {
        try {
            setCommentLength(post.comments.length)
            const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`,{text},{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if (res.data.success){
                // const updatedPostData = [...comments]
                setCommentLength(commentLength+1)
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:3000/api/v1/post/delete/${post._id}`,
                {
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                const updatedPostData = posts.filter((item) => item._id !== post._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
    const [open, setOpen] = useState(false);

    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post?.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h6>{post.author.username}</h6>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-fit text-[#ed4956]"
                        >
                            Unfollow
                        </Button>
                        <Button variant="ghost" className="cursor-pointer w-fit text-white">
                            Add To Favorite
                        </Button>
                        {user && user._id === post.author._id && (
                            <Button
                                variant="ghost"
                                onClick={deletePostHandler}
                                className="cursor-pointer w-fit text-white"
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className="rounded-sm w-full aspect-square object-cover"
                onDoubleClick={likeOrDislikeHandler}
                src={post.image}
                alt="no image found"
            />

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center justify-between gap-3">
                    {liked ? (
                        <FaHeart
                            size={"22px"}
                            onClick={likeOrDislikeHandler}
                            className="cursor-pointer text-red-600 hover:text-[#DC143C]"
                        />
                    ) : (
                        <FaRegHeart
                            onClick={likeOrDislikeHandler}
                            size={"22px"}
                            className="cursor-pointer hover:text-gray-600"
                        />
                    )}
                    <MessageCircle
                        onClick={() => setOpen(true)}
                        className="cursor-pointer hover:text-gray-600"
                    />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="font-medium block mb-2">{postLike} likes</span>
            <p>
                <span className="font-medium mr-2">{post.author.username}</span>
                {post.caption}
            </p>
            <span
                onClick={() => setOpen(true)}
                className="text-gray-500 cursor-pointer"
            >
                {post.comments.length > 0 &&
                    `View all ${commentLength} comments...`}
            </span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={text}
                    onChange={changeEventHandler}
                    className=" bg-white outline-none text-sm w-full"
                />
                {text && <span onClick={commentHandler} className="text-[#3badf8] cursor-pointer">Post</span>}
            </div>
        </div>
    );
}

export default Post;
