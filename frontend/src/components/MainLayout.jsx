import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
    return (
        <div className='w-screen flex box-border'>
            <LeftSidebar />
            <div className='flex flex-col flex-1'>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout