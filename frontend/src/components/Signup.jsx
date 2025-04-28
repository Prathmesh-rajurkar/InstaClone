import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
function Signup() {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const signUpHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://instaclone-wxtx.onrender.com/api/v1/user/register",
                input,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form
                onSubmit={signUpHandler}
                className="shadow-lg flex flex-col gap-5 p-8"
            >
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">LOGO</h1>
                    <p className="text-sm text-center">
                        Signup to see photos & videos from your friends
                    </p>
                </div>
                <div>
                    <span className="font-medium">Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className="font-medium">Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className="font-medium">Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Please Wait
                        </Button>) : (
                        <Button type="submit" className=''>
                            Signup
                        </Button>
                    )
                }
                <span className="text-center">
                    Already have an account?{" "}
                    <Link className="text-blue-500" to="/login">
                        Login
                    </Link>
                </span>
            </form>
        </div>
    );
}

export default Signup;
