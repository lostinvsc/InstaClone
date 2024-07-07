import React from 'react'
import Post from './Post'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
const Home = () => {

    let [post, setPost] = useState([])
    const [count, setCount] = useState(0)


    const getposts = async () => {
        const res = await axios.get('/getfollowingposts', {
            withCredentials: true
        });

if(res.data.count==1){
    
    let arr=[];
    let n=res.data.message.length;
    for (let i = 0; i <n; i++) {
       
        arr[i]=res.data.message[n-i-1]
        
    }
    setPost(arr)
    setCount(res.data.count)

}
   

    }
    useEffect(() => {
        getposts();
    },[])
    


    return (
        <>
        <Navbar/>
        <div className='mx-auto w-fit flex flex-col gap-[30px] my-[20px] border items-center'>
          
            
            {count!=0 &&
                post.map((value,index)=>{
                    return (
                        <Post getposts={getposts} key={index} url={value.img_url} caption={value.caption} create_by={value.create_by} username={value.username} post_id={value._id} />
                        
                    )
                    
                    
                })
            }

        </div>
            </>
    )
}

export default Home