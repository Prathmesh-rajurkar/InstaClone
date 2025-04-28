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
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/redux/store';
import { setPosts } from '@/redux/postSlice';
// import { preview } from 'vite';

function CreatePost({ open, setOpen }) {
    const imageRef = useRef();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const {posts} = useSelector(store=>store.post);
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file)
            const dataURL = await readFileAsDataURL(file);
            setImagePreview(dataURL)
        }

    }
    const createPostHandler = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);
        
        // Compress image before sending
        try {
            setLoading(true);
            // Append the original file name to maintain extension
            formData.append('image', file, file.name);
            
            const res = await axios.post('https://instaclone-wxtx.onrender.com/api/v1/post/addpost', 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                    maxBodyLength: Infinity, // Add this line
                    maxContentLength: Infinity // Add this line
                }
            );

            if (res.data.success) {
                dispatch(setPosts([res.data.post,...posts]));
                toast.success(res.data.message);
                setOpen(false);
                setFile(null);
                setCaption("");
                setImagePreview("");
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
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
                        <AvatarImage src={user?.profilePicture} alt='img' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs'>{user?.bio}</span>
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
                </Button><input ref={imageRef} onChange={fileChangeHandler} type='file' accept='image/*' className='w-full mt-2 hidden' />
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