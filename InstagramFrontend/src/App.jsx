import { useState,useEffect } from 'react'
import './App.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Signin from './Components/Signin'
import Signup from './Components/Signup'
import Profile from './Components/Profile'
import Home from './Components/Home'
import CreatePost from './Components/CreatePost'
import Cookies from 'js-cookie';
import UserProfile from './Components/UserProfile'
import FollowingPosts from './Components/FollowingPosts'

function App() {
  const [cookie, setCookie] = useState('')
  useEffect(() => {
    const value = Cookies.get("token")
    setCookie(value);
},)

  let router=createBrowserRouter([
   
    {
      path:'/Signin',
      element: <><Navbar/> <Signin/></>
    },
    {
      path:'/Signup',
      element:<><Navbar/> <Signup/></>
    },
    {
      path:'/profile',
      element:<><Navbar/> <Profile/></>
    },
    {
      path:'/userprofile/:create_by',
      element:<><Navbar/> <UserProfile/></>
    },
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/createpost',
      element:<><Navbar/> <CreatePost/></>
    },
    {
      path:'/followingposts',
      element:<FollowingPosts/>
    },
  ])

  return (
   
<RouterProvider router={router}/>

  )
}

export default App
