import { useState } from "react";
import "./App.css";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
      children: [
        {
          path: '/',
          element: <ProtectedRoutes><Home /></ProtectedRoutes>
        },
        {
          path: '/profile/:id',
          element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
        },
        // {
        //   path: '/account/edit',
        //   element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
        // },
        // {
        //   path: '/chat',
        //   element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
        // },
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    }
  ]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
