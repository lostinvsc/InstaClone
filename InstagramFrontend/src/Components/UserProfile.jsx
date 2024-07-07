import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
const Profile = () => {
    let [post, setPost] = useState([])
    const [length, setLength] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false)
    const [first, setFirst] = useState(false)
    const [followin, setFollowin] = useState(0)
    const [followers, setFollowers] = useState(0)

    let create_by = useParams().create_by;
    const getposts = async () => {
        const res = await axios.get(`/userprofile/${create_by}`, {
            withCredentials: true
        });
        setPost(res.data)
        setLength(res.data.message.length)
    }
    useEffect(() => {
        getposts();
    }, [])

    const following = async () => {
        let data = { following: post.message[0].username }
        const res = await axios.put(`/following`, data, {
            withCredentials: true
        });
        setFirst(res.data.message)
    

    }

    const getfollow = async () => {
        
        if (post.message) {
            let username = post.message[0].username
            const res = await axios.get(`/following/${username}`, {
                withCredentials: true
            });
            setIsFollowing(res.data.message)
            if (res.data.message) {
                setFollowin(res.data.following.length)
                setFollowers(res.data.followers.length)
            } else {
                setFollowin(0)
                setFollowers(0)
            }

        }

    }

    useEffect(() => {
        getfollow()
    }, [post, first])



    return (
        <>
            <div className='flex justify-center mt-[20px]'>
                <div style={{ width: 'min(600px, 95vw)' }} className=''>
                    <div className='flex  justify-between'>
                        <div>
                            <img className='rounded-full border w-[60%] min-w-[70px] border-black' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s" alt="" />
                        </div>
                        <div className='flex flex-col gap-[30px]'>
                            <h1 className='text-[3rem] font-bold leading-10'>{post.length != 0 && post.message[0].username}</h1>
                            <p className='aboutfollow'>
                                <span>{length} Post{length > 1 && <span>s</span>}</span>
                                <span>{followers} Follower{followers > 1 && <span>s</span>}</span>
                                <span>{followin} Following</span>
                            </p>
                            <div><button onClick={following} className='bg-pink-600 w-fit px-[5px] py-[4px] text-white rounded-lg'>
                                {isFollowing ? <div>UnFollow</div> : <div >Follow</div>}
                            </button></div>
                        </div>
                    </div>
                    <hr className='border-[0.5px] border-gray-600 w-[100%] my-[50px]' />

                    <div className='flex flex-wrap gap-[15px] justify-center '>

                        {post.count == 1 &&
                            post.message.map((value, index) => {
                                return (

                                    <div key={index} className='postimage flex items-center border rounded-lg h-[200px]'>
                                        <img className='w-[100%] h-[100%] rounded-lg object-contain' src={value.img_url} alt="" />
                                        <div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>

        </>
    )
}

export default Profile