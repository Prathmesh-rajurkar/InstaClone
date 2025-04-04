import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
function Post() {
    const [text,setText] = useState("");
    const changeEventHandler = (e) =>{
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText)
        }else{
            setText("")
        }
    } 
    const [open,setOpen] = useState(false);
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h6>username</h6>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ed4956]'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit text-white'>Add To Favorite</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit text-white'>Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm w-full aspect-square object-cover' src="https://images.unsplash.com/photo-1732919258508-3fd53a8007b6?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="no image found" />

            <div className='flex items-center justify-between mt-2'>

                <div className='flex items-center justify-between gap-3'>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>1k likes</span>
            <p>
                <span className='font-medium mr-2'>username</span>
                caption
            </p>
            <span onClick={() => setOpen(true)} className='text-gray-500 cursor-pointer'>View all 10 comments...</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input type="text" placeholder='Add a comment' value={text} onChange={changeEventHandler} className=' bg-white outline-none text-sm w-full' />
                {
                    text && 
                <span className='text-[#3badf8]'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post