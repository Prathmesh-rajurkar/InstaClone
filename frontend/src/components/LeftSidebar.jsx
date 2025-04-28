import {
    Heart,
    Home,
    InstagramIcon,
    LogOut,
    MessageCircle,
    PlusSquare,
    Search,
    TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";


function LeftSidebar() {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const logoutHandler = async () => {
        try {
            const res = await axios.get("https://instaclone-wxtx.onrender.com/api/v1/user/logout", {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        }
        if (textType === "Home") {
            navigate("/");
        }
        if (textType === "Create") {
            setOpen(true);
        }
    };
    const sidebarItems = [
        {
            icon: <Home />,
            text: "Home",
        },
        {
            icon: <Search />,
            text: "Search",
        },
        {
            icon: <TrendingUp />,
            text: "explore",
        },
        {
            icon: <MessageCircle />,
            text: "Messages",
        },
        {
            icon: <Heart />,
            text: "Notification",
        },
        {
            icon: <PlusSquare />,
            text: "Create",
        },
        {
            icon: (
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile",
        },
        {
            icon: <LogOut />,
            text: "Logout",
        },
    ];
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className="flex flex-col">
                <span className="my-8 pl-3 font-bold text-2xl flex items-center gap-2">
                    <InstagramIcon />
                    Instagram
                </span>
                <div>
                    {sidebarItems.map((item, index) => {
                        return (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className="flex items-center gap-3 p-2 m-3 relative hover:bg-gray-200 rounded-md cursor-pointer"
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>

    );
}

export default LeftSidebar;
