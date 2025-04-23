import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import PostComment from "./PostComment";

function CommentDialog({ open, setOpen }) {
    const [text, setText] = useState("");
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };
    const sendMessageHandler = async () => {
        try {
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const { selectedPost } = useSelector((store) => store.post);

    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className="max-w-5xl p-0 flex flex-col"
            >
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            className="rounded-sm w-full aspect-square object-cover"
                            src={selectedPost?.image}
                            alt="no image found"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col justify-between p-2">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center ">
                                <Link className="text-black">
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex flex-col">
                                    <Link className="font-semibold text-sm text-black">
                                        {selectedPost?.author?.username}
                                    </Link>
                                    <span className="text-xs text-gray-400">
                                        {selectedPost?.author?.bio}
                                    </span>
                                </div>
                            </div>
                            <Dialog className="">
                                <DialogTrigger asChild>
                                    <MoreHorizontal />
                                </DialogTrigger>
                                <DialogContent className="flex w-[12%] flex-col items-center text-sm text-center">
                                    <div className="cursor-pointer w-full text-[#ed4956] font-bold">
                                        Unfollow
                                    </div>

                                    <div className="cursor-pointer w-full  font-bold">
                                        Add To Favorite
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr className="text-gray-800" />
                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
                            {
                                selectedPost?.comments.map((comment)=> <PostComment key={comment._id} comment={comment} />)   
                            }
                        </div>
                        <div>
                            <div className="flex">
                                <input
                                    type="text"
                                    onChange={changeEventHandler}
                                    value={text}
                                    placeholder="Add a comment..."
                                    className="bg-white w-full outline-none border p-2 rounded border-gray-300"
                                />
                                <Button
                                    onClick={sendMessageHandler}
                                    disabled={!text.trim()}
                                    className="bg-white"
                                    variant="Outline"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;
