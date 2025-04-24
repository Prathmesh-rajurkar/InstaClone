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
        <div className='flex w-screen box-border'>
            <div className="flex-grow w-[75%] flex items-center">
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home