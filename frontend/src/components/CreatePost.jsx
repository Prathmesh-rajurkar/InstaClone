import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
// import { preview } from 'vite';

function CreatePost({ open, setOpen }) {
    const imageRef = useRef();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        // console.log(e.target.files);
        // console.log("/////////////");
        // console.log(file);
        if (file) {
            setFile(file)
            const dataURL = await readFileAsDataURL(file);
            setImagePreview(dataURL)
            // console.log(dataURL);

        }

    }
    const createPostHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', caption);
        // console.log(file);

        formData.append('image', file);
        try {
            setLoading(true);
            console.log(file);
            console.log('_____________________________');
            console.log(caption);
            console.log('_____________________________');
            console.log(formData);



            const res = await axios.post('http://localhost:3000/api/v1/post/addpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.log(error);
        } finally {
            setLoading(false)
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
                {
                    imagePreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img className='object-cover rounded-md w-full h-full' src={imagePreview} alt="preview.png" />
                        </div>
                    )
                }
                <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Write a caption...' />

                <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>
                    Select from Computer
                </Button><input ref={imageRef} onChange={fileChangeHandler} type='file' accept='.png,.jpg,.jpeg' className='w-full mt-2 hidden' />
                {
                    imagePreview && (
                        loading ? (
                            <Button>
                                <Loader2 />
                            </Button>
                        ) : (
                            <Button type='submit' onClick={createPostHandler} className='w-full mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>
                                Post
                            </Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>

    )
}

export default CreatePost