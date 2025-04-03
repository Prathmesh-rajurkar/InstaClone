import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const signUpHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={signUpHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="my-4">
                    <h1 className="text-center m-2 text-xl">Instagram</h1>
                    <p className="text-sm text-center">
                        Login to see photos & videos from your friends
                    </p>
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
                                Login
                            </Button>
                        )
                    }

                    <span className="text-center">
                        Doesn't have an account?{" "}
                        <Link className="text-blue-500" to="/signup">
                            Register
                        </Link>
                    </span>
            </form>
        </div>
    );
}

export default Login;
