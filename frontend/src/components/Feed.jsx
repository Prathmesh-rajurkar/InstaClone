import React from 'react'
import Posts from './Posts'

function Feed() {
    return (
        <div className='flex-1 my-8  w-[50%] flex flex-col items-center justify-between pl-[20px]'>
            <Posts />
        </div>
    )
}

export default Feed