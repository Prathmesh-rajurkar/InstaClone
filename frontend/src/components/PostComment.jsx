import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function PostComment({comment}) {
  return (
    <div className='flex flex-col'>
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-semibold text-sm'>{comment?.author.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>
            </div>
        </div>
    </div>
  )
}

export default PostComment