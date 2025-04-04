import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'

function CommentDialog({ open, setOpen }) {
    const [text, setText] = useState("");
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    const sendMessageHandler = async () => {
        try {

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img className='rounded-sm w-full aspect-square object-cover' src="https://images.unsplash.com/photo-1732919258508-3fd53a8007b6?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="no image found" />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between p-2'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center '>

                                <Link className='text-black'>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='flex flex-col'>
                                    <Link className='font-semibold text-sm text-black'>username</Link>
                                    <span className='text-xs text-gray-400'>bio</span>
                                </div>
                            </div>
                            <Dialog className="">
                                <DialogTrigger asChild>
                                    <MoreHorizontal />
                                </DialogTrigger>
                                <DialogContent className="flex w-[12%] flex-col items-center text-sm text-center">
                                    <div className='cursor-pointer w-full text-[#ed4956] font-bold'>
                                        Unfollow
                                    </div>

                                    <div className='cursor-pointer w-full  font-bold'>
                                        Add To Favorite
                                    </div>

                                </DialogContent>
                            </Dialog>

                        </div>
                        <hr className='text-gray-800' />
                        <div className='flex flex-1 overflow-y-auto max-h-96 p-4'>
                            comments aayenge
                        </div>
                        <div>
                            <div className='flex'>
                                <input type="text" onChange={changeEventHandler} value={text} placeholder='Add a comment...' className='bg-white w-full outline-none border p-2 rounded border-gray-300' />
                                <Button onClick={sendMessageHandler} disabled={!text.trim()} className="bg-white" variant='Outline'>Send</Button>

                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog