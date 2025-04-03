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
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

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
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile",
    },
    {
        icon: <LogOut />,
        text: "Logout",
    },
];
function LeftSidebar() {
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
                withCredentials: true,
            });
            if (res.data.success) {
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
    };
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
        </div>
    );
}

export default LeftSidebar;
