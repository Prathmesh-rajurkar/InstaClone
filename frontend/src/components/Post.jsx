import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function Post() {
    return (
        <div>
            <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Post