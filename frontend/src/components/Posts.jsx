import React, { useEffect } from 'react'
import Post from './Post';
import { useSelector } from 'react-redux';
import { store } from '@/redux/store';
import useGetAllPosts from '@/hooks/useGetAllPosts';

function Posts() {
    // useGetAllPosts();
    const {posts} = useSelector(store=>store.post)
    return (
        <div className='flex flex-col items-center justify-between pl-[20%]'>
            {
                posts.map((post) => <Post key={post._id} post={post} />)
            }
        </div>
    )
}

export default Posts;