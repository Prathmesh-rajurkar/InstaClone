import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'

function CreatePost(open, setOpen) {
    const createPostHandler = async (e) => {
        e.preventDefault();
        try {

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteraction={() => setOpen(false)} className="sm:max-w-[425px]">
                    <form onSubmit={createPostHandler}>

                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreatePost