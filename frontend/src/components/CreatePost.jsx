import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

function CreatePost({ open, setOpen }) {
    const imageRef = useRef();
    const [file,setFile] = useState("");
    const [caption,setCaption] = useState("");
const [imagePreview, setImagePreview] = useState("");
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file){
            setFile(file)
            const dataURL = await readFileAsDataUri(file);
            setImagePreview(dataURL)
        }

    }
    const createPostHandler = async (e) => {
        e.preventDefault();
        try {
            // Add your post creation logic here
            console.log("Post created");
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenChange = React.useCallback((newOpen) => {
        setOpen(newOpen);
    }, [setOpen]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src='' alt='img' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>Username</h1>
                        <span className='text-gray-600 text-xs'>Bio here...</span>
                    </div>
                </div>
                <Textarea className='focus-visible:ring-transparent border-none' placeholder='Write a caption...' />
                <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>
Select from Computer
                </Button><input ref={imageRef} onChange={fileChangeHandler} type='file' accept='.png,.jpg,.jpeg' className='w-full mt-2 hidden' />
            </DialogContent>
        </Dialog>
        
    )
}

export default CreatePost