import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetSuggestedUsers from '@/hooks/useGetAllSuggestedUsers'

function Home() {
    useGetAllPosts();
    useGetSuggestedUsers();
    return (
        <div className='flex w-screen'>
            <div className="flex-grow flex">
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home